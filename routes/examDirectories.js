const express = require('express');
const { body } = require('express-validator');

const examDirectoriesController = require('../controllers/examDirectories');
const isAuth = require('../auth/is-auth');

const router = express.Router();


// GET /exam-directories/{directoryId}
router.get('/:directoryId',isAuth, examDirectoriesController.getDirectory);//TESTED
// PUT /exam-directories/upload/:courseId ,HEADER Authentication : token
router.put('/upload/:courseId',isAuth,examDirectoriesController.createDirectory);//TESTED
// PUT  /exam-directories/add-summary/{directoryId}/{summaryId}
router.put('/add-summary/:directoryId/:summaryId',isAuth, examDirectoriesController.addFileToDirectory);//TESTED

module.exports = router;
