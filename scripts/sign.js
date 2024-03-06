// Fonction pour obtenir les octets d'un fichier
async function getBytesFromFile(file) {
  return new Uint8Array(await file.arrayBuffer());
}

// Fonction pour télécharger un fichier
function downloadFile(data, filename) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}

// Fonction pour convertir une base64 en Uint8Array
function base64ToUint8Array(base64) {
  const binaryString = atob(base64.split(',')[1]);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes;
}

document.addEventListener('DOMContentLoaded', () => {
  const canvas = document.getElementById('signatureCanvas');
  const signaturePad = new SignaturePad(canvas);

  // Bouton de réinitialisation
  const resetButton = document.getElementById('resetButton');
  resetButton.addEventListener('click', () => {
    signaturePad.clear();
  });

  // Bouton de signature
  const signButton = document.getElementById('signButton');
  signButton.addEventListener('click', () => {
    const pdfToSignInput = document.getElementById('pdfToSign');

    // Vérifie si le canvas a été signé
    if (!signaturePad.isEmpty()) {
      // Demande à l'utilisateur de spécifier les coordonnées
      const xCoordinate = prompt('Veuillez saisir la coordonnée X pour la signature :');
      const yCoordinate = prompt('Veuillez saisir la coordonnée Y pour la signature :');

      // Charge le PDF à signer
      getBytesFromFile(pdfToSignInput.files[0]).then(async (pdfBytes) => {
        try {
          const pdfDoc = await PDFLib.PDFDocument.load(pdfBytes);

          // Ajoute la signature à la première page aux coordonnées spécifiées
          const firstPage = pdfDoc.getPages()[0];
          const signatureImage = signaturePad.toDataURL();
          const signatureImageObject = await pdfDoc.embedPng(base64ToUint8Array(signatureImage));
          firstPage.drawImage(signatureImageObject, {
            x: parseFloat(xCoordinate) || 50, // Valeur par défaut 50 si l'utilisateur ne saisit rien
            y: parseFloat(yCoordinate) || 50, // Valeur par défaut 50 si l'utilisateur ne saisit rien
            width: 100,
            height: 50,
          });

          // Enregistre le PDF signé
          const signedPdfBytes = await pdfDoc.save();
          downloadFile(signedPdfBytes, 'signed.pdf');
        } catch (error) {
          console.error('Erreur lors de la signature du PDF:', error);
        }
      });
    } else {
      alert('Veuillez signer avant de continuer.');
    }
  });
});
