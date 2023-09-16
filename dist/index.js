"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const path_1 = __importDefault(require("path"));
const fs_1 = __importDefault(require("fs"));
const morgan_1 = __importDefault(require("morgan"));
const app = (0, express_1.default)();
const port = 3000;
app.use((0, morgan_1.default)('dev'));
// Configuración de multer para subir archivos
const storage = multer_1.default.diskStorage({
    destination: function (req, file, cb) {
        cb(null, 'uploads/');
    },
    filename: function (req, file, cb) {
        cb(null, file.originalname);
    }
});
const upload = (0, multer_1.default)({ storage: storage });
// Ruta para subir archivos
app.get('/upload', (req, res) => {
    res.send(`
    <form action="/upload" method="POST" enctype="multipart/form-data">
      <input type="file" name="file" />
      <button type="submit">Subir archivo</button>
    </form>
  `);
});
app.post('/upload', upload.single('file'), (req, res) => {
    res.redirect('/download');
});
// Ruta para descargar archivos
app.get('/download', (req, res) => {
    const directoryPath = path_1.default.join(__dirname, 'uploads');
    fs_1.default.readdir(directoryPath, (err, files) => {
        if (err) {
            return res.status(500).send('Error al leer los archivos.');
        }
        let fileList = '';
        files.forEach(file => {
            fileList += `<li><a href="/download/${file}">${file}</a></li>`;
        });
        res.send(`
      <h1>Archivos subidos:</h1>
      <ul>${fileList}</ul>
    `);
    });
});
app.get('/download/:filename', (req, res) => {
    const filePath = path_1.default.join(__dirname, 'uploads', req.params.filename);
    res.download(filePath);
});
// Iniciar el servidor
app.listen(port, () => {
    console.log(`Servidor en funcionamiento en http://localhost:${port}`);
});
