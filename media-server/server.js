const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const cors = require('cors');

const app = express();
const port = 3000;

// Usar cors middleware
app.use(cors());

// Configurar Multer para el almacenamiento de archivos
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    const { mediaType } = req.query;
    const uploadPath = path.join(__dirname, 'uploads', mediaType);
    if (!fs.existsSync(uploadPath)) {
        fs.mkdirSync(uploadPath, { recursive: true });
    }
    cb(null, uploadPath);
  },
  filename: (req, file, cb) => {
    const { fileName } = req.query;
    cb(null, `${fileName}${path.extname(file.originalname)}`);
  },
});

const upload = multer({ storage });

// Ruta para subir archivos
app.post('/upload', upload.single('file'), (req, res) => {
    res.send(`File ${req.query.fileName} uploaded successfully!`);
});

// Ruta para obtener archivos
app.get('/get', (req, res) => {
    const { mediaType, fileName } = req.query;
    const filePath = path.join(__dirname, 'uploads', mediaType, fileName);
  
    if (fs.existsSync(filePath)) {
      res.sendFile(filePath);
    } else {
      res.status(404).send('File not found');
    }
  });

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
