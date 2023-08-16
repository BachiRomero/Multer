import express from 'express';
import multer from 'multer';
import { dirname, extname, join } from 'path';
import { fileURLToPath } from 'url';

const PORT = 3000;

// sacar ruta relativa
const CURRENT_DIR = dirname(fileURLToPath(import.meta.url));
const MIMETYPES = ['image/jpg', 'image/png', 'image/jpeg'];

const multerUpload = multer({
    // definimos carpeta de Destino
    storage: multer.diskStorage({
        destination: join(CURRENT_DIR, '../uploads'),
        filename: (req, file, cb) => {
            const fileExtension = extname(file.originalname);
            const fileName = file.originalname.split(fileExtension)[0];
            cb(null, `${fileName}-${Date.now()}${fileExtension}`);
        },
    }),
    // filtramos tipos de archivos
    fileFilter: (req, file, cb) => {
        if (MIMETYPES.includes(file.mimetype)) cb(null, true);
        else cb(new Error(`Only ${MIMETYPES.join(' ')} mimetypes are allowed`));
    },
    // definimos limites
    limits: {
        //limite de tamaño
        fieldSize: 10000000,
    },
});

const server = express();

server.post('/upload', multerUpload.single('file'), (req, res) => {
    console.log(req.file);
    res.sendStatus(200);
});

server.listen(PORT, () => {
    console.log(`Server listening in port ${PORT}`);
});
