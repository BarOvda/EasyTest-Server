const express = require('express');
const { body } = require('express-validator');

const isAuth = require('../middlewares/IsAuth.middleware');
const feedController = require('../controllers/feed');
const router = express.Router();

//GET /feed
router.get('/'// TODO - TESTS
    ,isAuth
    , feedController.getFeed); 
// GET /feed/search
router.get('/search'// TESTED
    ,isAuth
    ,[ body('keyWord')]
    , feedController.searchSummaryByKeyWord); 
// GET /feed/search/course/:courseId
router.get(//TESTED
    '/search/course/:courseId'
    ,isAuth
    , feedController.searchSummaryByCourse);
    // GET /feed/search/course/key-word/:courseId
router.get(//TESTED
    '/search/course/key-word/:courseId'
    ,isAuth
    ,[ body('keyWord')]
    , feedController.searchSummaryByCourseAndKeyWord);
    
module.exports = router;