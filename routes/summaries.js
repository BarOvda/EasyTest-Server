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
// PUT /summaries/upload/{courseAppId}
router.put(//TESTED
  '/upload:courseAppId'
  ,isAuth
  ,upload.single('file')
  ,summaryController.uploadSummary
);
// GET /summaries/my-uploads
router.get(//TESTED
'/my-uploads'
,isAuth
, summaryController.getUserUploads);

// GET /summaries/users-rank/:summaryId
router.get(//TODO - TESTS
  '/users-rank/:summaryId'
  ,isAuth
  , summaryController.getUsersRank);
  
  
// PUT /summaries/rank-up/:summaryId
router.put(//TESTED!
  '/rank-up/:summaryId'
  ,isAuth
  ,[ body('rank')]
  , summaryController.rankUp);
module.exports = router;