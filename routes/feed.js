const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../auth/is-auth');

const feedController = require('../controllers/feed');
const router = express.Router();


// GET /feed/search
router.get('/search'
,[ body('keyWord')]
, feedController.searchSummaryByKeyWord);
// // PUT /summaries/upload
// router.put(//TESTED
//   '/upload'
//   ,isAuth
//   ,upload.single('file')
//   ,[ body('title')]
//   ,summaryController.uploadSummary
// );
// // GET /summaries/my-uploads
// router.get(//TESTED
// '/my-uploads'
// ,isAuth
// , summaryController.getUserUploads);

// // GET /summaries/course-summaries/:courseId
// router.get(//TODO
//   '/course-summaries/:courseId'
//   ,isAuth
//   , summaryController.getCourseSummaries);
// // PUT /summaries/rank-up/:summaryId
// router.get(//TODO
//   '/rank-up/:summaryId'
//   ,isAuth
//   ,[ body('rank')]
//   , summaryController.rankUp);
module.exports = router;