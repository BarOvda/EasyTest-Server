const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const isAuth = require('../auth/is-auth');
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
router.get('/all-summaries', summaryController.getAllSummaries);//TESTED
// PUT /summaries/upload
router.put(//TESTED
  '/upload'
  ,isAuth
  ,upload.single('file')
  ,[ body('title')]
  ,summaryController.uploadSummary
);
// GET /summaries/my-uploads
router.get(//TESTED
'/my-uploads'
,isAuth
, summaryController.getUserUploads);


// PUT /summaries/rank-up/:summaryId
router.get(//TODO
  '/rank-up/:summaryId'
  ,isAuth
  ,[ body('rank')]
  , summaryController.rankUp);
module.exports = router;