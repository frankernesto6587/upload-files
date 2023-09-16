import express from 'express';
import multer from 'multer';
import morgan from 'morgan';

const app = express();
const port = 3000;

app.use(morgan('dev'));

// Configuración de multer para subir archivos
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/');
  },
  filename: function (req, file, cb) {
    cb(null, file.originalname);
  }
});

const upload = multer({ storage: storage }).array('files');

// Ruta para subir archivos
app.get('/', (req, res) => {
  res.send(`
  <div >
  <h1>Upload File</h1>
    <form action="/" method="POST" enctype="multipart/form-data">
      <input type="file" name="files" multiple />
      <button type="submit">Subir archivos</button>
    </form>
  </div>
  `);
});

app.post('/', (req, res) => {
  upload(req, res, function (err) {
    if (err) {
      return res.status(500).send('Error al subir los archivos.');
    }
    res.redirect('/');
  });
});

// Iniciar el servidor
app.listen(port, () => {
  console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});