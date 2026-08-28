const multer = require('multer');
const path = require('path');

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, 'uploads/salles'),
  filename: (req, file, cb) => {
    const extension = path.extname(file.originalname);
    cb(null, `salle-${req.params.id}-${Date.now()}${extension}`);
  },
});

function fileFilter(req, file, cb) {
  const typesAutorises = ['image/jpeg', 'image/png', 'image/webp'];
  if (!typesAutorises.includes(file.mimetype)) {
    return cb(new Error('Seules les images JPEG, PNG ou WEBP sont acceptées'));
  }
  cb(null, true);
}

const upload = multer({ storage, fileFilter, limits: { fileSize: 5 * 1024 * 1024 } });

module.exports = upload;