const multer = require('multer');

exports.fileHandler = async (req, res, next) => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'public/files');
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
      const fileFilter = (req, file, cb) => {
        if (

            file.mimetype === 'file/pdf' ||
            file.mimetype === 'file/docx' 
          
        ) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      };
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('file');

    next();
}
exports.imageHandler = async (req, res, next) => {
    const fileStorage = multer.diskStorage({
        destination: (req, file, cb) => {
          cb(null, 'public/images');
        },
        filename: (req, file, cb) => {
          cb(null, Date.now() + '-' + file.originalname);
        }
      });
      const fileFilter = (req, file, cb) => {
        if (
            file.mimetype === 'image/png' ||
            file.mimetype === 'image/jpg' ||
            file.mimetype === 'image/jpeg'
        ) {
          cb(null, true);
        } else {
          cb(null, false);
        }
      };
    multer({ storage: fileStorage, fileFilter: fileFilter }).single('image');
      console.log('middleware');
    next();
}