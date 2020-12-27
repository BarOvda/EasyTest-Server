const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');

const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/files');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'));//replace all ' ' with '_'
  }
});

var upload = multer({ storage: fileStorage });


const summaryController = require('../controllers/summaries');

const router = express.Router();

// GET /summaries/all-summaries
//router.get('/all-summaries', summaryController.getSummaries);

// POST /summaries/upload/{userId}
router.put(
  '/upload/:userId',
  upload.single('file'),
  [
    body('title')
  ],
  summaryController.uploadSummary
);
// GET /summaries/my-uploads/{userId}
//router.get('/my-uploads/:userId', usersController.getUserUploads);



module.exports = router;
