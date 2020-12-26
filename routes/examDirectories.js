const express = require('express');
const { body } = require('express-validator');

const examDirectoriesController = require('../controllers/examDirectories');
const isAuth = require('../auth/is-auth');

const router = express.Router();



// GET /exam-directories/{directoryId}
router.get('/:directoryId', examDirectoriesController.getDirectory);//TODO
// PUT /exam-directories/upload/:courseId ,HEADER Authentication : token
router.put('/upload/:courseId',isAuth,examDirectoriesController.createDirectory);//TODO
// PUT /exam-directories/add-summary/{directoryId}/{summaryId}
router.put('/directory/:directoryId/:summaryId', examDirectoriesController.addFileToDirectory);//TODO
module.exports = router;
