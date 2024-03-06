async function jpgToPdf() {
  const jpgFilesInput = document.getElementById('jpgFiles');
  const jpgFiles = jpgFilesInput.files;

  const pdfDoc = await PDFLib.PDFDocument.create();

  for (let i = 0; i < jpgFiles.length; i++) {
    const jpgFile = jpgFiles[i];

    // Convertir chaque fichier JPG en Uint8Array
    const jpgBytes = await getBytesFromFile(jpgFile);

    // Embed le JPG dans le PDF
    const image = await pdfDoc.embedJpg(jpgBytes);

    // Ajouter une nouvelle page au PDF avec l'image
    const page = pdfDoc.addPage();
    const { width, height } = image.scale(0.5);
    page.drawImage(image, {
      x: 0,
      y: 0,
      width,
      height,
    });
  }

  // Enregistre le PDF résultant
  const pdfBytes = await pdfDoc.save();
  downloadFile(pdfBytes, 'output.pdf');
}

// Fonction pour obtenir les octets d'un fichier
function getBytesFromFile(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(new Uint8Array(reader.result));
    reader.onerror = reject;
    reader.readAsArrayBuffer(file);
  });
}

// Fonction pour télécharger un fichier
function downloadFile(data, filename) {
  const blob = new Blob([data], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = window.URL.createObjectURL(blob);
  link.download = filename;
  link.click();
}
