function fetchPdfBytes(path) {
  return fetch(path).then(response => response.arrayBuffer());
}

async function compressPDF() {
  const { PDFDocument } = PDFLib;

  // Récupérer l'élément input de type fichier
  const pdfToCompressInput = document.getElementById('pdfToCompress');
  
  // Assurez-vous qu'un fichier a été sélectionné
  if (!pdfToCompressInput.files || pdfToCompressInput.files.length === 0) {
    alert('Veuillez sélectionner un fichier PDF à compresser.');
    return;
  }

  // Récupérer le fichier depuis l'élément input
  const pdfToCompress = pdfToCompressInput.files[0];

  async function compresserPDF(pdfFile) {
    try {
      const pdfBytes = await getBytesFromFile(pdfFile);
      const pdfDoc = await PDFDocument.load(pdfBytes);



      // Utiliser les fonctionnalités de pdf-lib pour compresser le PDF si nécessaire

      const compressedPdfBytes = await pdfDoc.save();
      await savePdfBytes('/chemin/vers/pdf_compressé.pdf', compressedPdfBytes);
    } catch (error) {
      console.error('Erreur lors de la compression du PDF:', error);
    }
  }

  // Utilisation de la fonction compresserPDF avec le fichier récupéré depuis l'élément input
  await compresserPDF(pdfToCompress);
}

// Fonction pour obtenir les octets d'un fichier
async function getBytesFromFile(file) {
  return new Uint8Array(await file.arrayBuffer());
}

// Fonction pour télécharger un fichier
async function savePdfBytes(outputPath, data) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = outputPath;
  link.click();
}
