async function mergePDF() {
  const { PDFDocument } = PDFLib;

  // Récupérer l'élément input de type fichier
  const pdfFilesInput = document.getElementById('pdfFiles');
  
  // Assurez-vous qu'au moins deux fichiers ont été sélectionnés
  if (!pdfFilesInput.files || pdfFilesInput.files.length < 2) {
    alert('Veuillez sélectionner au moins deux fichiers PDF à fusionner.');
    return;
  }

  // Récupérer les fichiers depuis l'élément input
  const pdfFiles = Array.from(pdfFilesInput.files);
  console.log("pdfFiles ==>", pdfFiles);
  
  // Créez une copie du tableau
  const pdfFilesCopy = [...pdfFiles];
  
  // Inversez la copie du tableau
  const pdfFilesInverse = pdfFilesCopy.reverse();
  console.log("pdfFilesInverse ==>", pdfFilesInverse);

  async function mergePDFs(machin, outputPath) {
    const mergedPdf = await PDFDocument.create();
    
    // Parcourir les fichiers en commençant par le premier (inversé)
    for (let i = 0; i < pdfFilesInverse.length; i++) {
      const pdfFile = machin[i];
      const pdfBytes = await getBytesFromFile(pdfFile);
      const pdfDoc = await PDFDocument.load(pdfBytes);
      const copiedPages = await mergedPdf.copyPages(pdfDoc, pdfDoc.getPageIndices());
      copiedPages.forEach((page) => mergedPdf.addPage(page));
    }

    const mergedPdfBytes = await mergedPdf.save();
    await savePdfBytes(outputPath, mergedPdfBytes);
  }

  // Utilisation de la fonction mergePDFs avec les fichiers récupérés depuis l'élément input
  const outputPath = 'fusionne.pdf';
  await mergePDFs(pdfFilesInverse, outputPath);
}
