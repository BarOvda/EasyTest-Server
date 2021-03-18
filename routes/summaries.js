const express = require('express');
const { body } = require('express-validator');
const multer = require('multer');
const isAuth = require('../auth/is-auth');
const fileStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, 'public/files');
  // },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'));//replace all ' ' with '_'
  }
});
var upload = multer({ storage: fileStorage });
const summaryController = require('../controllers/summaries');
const router = express.Router();


// GET /summaries/all-summaries
router.get('/all-summaries', summaryController.getAllSummaries);//TESTED
// GET /summaries/:id
router.get('/:id', isAuth, summaryController.getSummaryDetailes);//TESTED
// PUT /summaries/upload/{courseAppId}
router.put(//TESTED
  '/upload/:courseAppId'
  , isAuth
  , upload.single('file')
  , [body('isPrivate')]
  , summaryController.uploadSummary
);

// PUT /summaries/upload/directory/:directoryId
router.put(//TESTED
  '/upload/directory/:directoryId'
  , isAuth
  , upload.single('file')
  , [body('isPrivate')]
  , summaryController.uploadSummaryToDirectory
);
// DELETE /summaries/directory/:directoryId/:summaryId
router.delete(//TESTED
  '/directory/:directoryId/:summaryId'
  , isAuth
  , summaryController.deleteSummaryFromDirectory
);


// GET /summaries/my-uploads
router.get(//TESTED
  '/my-uploads'
  , isAuth
  , summaryController.getUserUploads);

// GET /summaries/users-rank/:summaryId
router.get(//TODO - TESTS
  '/users-rank/:summaryId'
  , isAuth
  , summaryController.getUsersRank);

// PUT /summaries/rank/:summaryId
router.put(//TESTED!
  '/rank/:summaryId'
  , isAuth
  , [body('rank')]
  , summaryController.rankUp);

// Post /summaries/search/key-word

router.post(
  '/search/key-word'
  // ,isAuth
  , [body('keyWord'),body('courseId')]
  , summaryController.searchByKeyWord);
module.exports = router;