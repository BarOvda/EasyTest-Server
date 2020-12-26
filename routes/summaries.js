const express = require('express');
const { body } = require('express-validator');

const summaryController = require('../controllers/summaries');

const router = express.Router();

// GET /summaries/all-summaries
router.get('/all-summaries', summaryController.getSummaries);

// POST /summaries/upload/{userId}
router.post(
  '/upload/:userId',
  //TODO : complete body
  [
    body('title')
  ],
  usersController.createUser
);
// GET /summaries/my-uploads/{userId}
router.get('/my-uploads/:userId', usersController.getUserUploads);



module.exports = router;
