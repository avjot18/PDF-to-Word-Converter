const express = require('express');
const multer = require('multer');
const { convert } = require('pdf2docx');
const fs = require('fs');

const app = express();

app.use(express.static('public'));

// Set up multer for file upload
const storage = multer.memoryStorage();
const upload = multer({ storage }).single('pdf');

app.post('/convert', upload, async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).send('No PDF file found.');
    }

    const pdfBuffer = req.file.buffer;

    const convertedBuffer = await convert(pdfBuffer);

    res.setHeader('Content-Disposition', 'attachment; filename=converted.docx');
    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document');
    res.send(convertedBuffer);
  } catch (error) {
    console.error(error);
    res.status(500).send('An error occurred during conversion.');
  }
});

app.listen(3000, () => {
  console.log('Server is running on port 3000');
});
