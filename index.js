const express = require('express');
const multer = require('multer');
const pdf2docx = require('pdf2docx');
const fs = require('fs');

const app = express();
const upload = multer({ dest: 'uploads/' });

app.post('/convert', upload.single('pdf'), (req, res) => {
  const pdfPath = req.file.path;
  const docxPath = `converted_${req.file.originalname.replace('.pdf', '.docx')}`;

  pdf2docx.convert(pdfPath, docxPath, (error, result) => {
    if (error) {
      console.error(error);
      return res.status(500).send('An error occurred during conversion.');
    }
    
    // Send the converted Word document as a download
    res.download(docxPath, err => {
      if (err) {
        console.error(err);
        return res.status(500).send('An error occurred while downloading the converted file.');
      }
      
      // Clean up the temporary files
      fs.unlink(pdfPath, err => {
        if (err) console.error(`Failed to delete PDF file: ${pdfPath}`);
      });
      fs.unlink(docxPath, err => {
        if (err) console.error(`Failed to delete DOCX file: ${docxPath}`);
      });
    });
  });
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
