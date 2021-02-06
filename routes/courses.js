const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../auth/is-auth');
const coursesController = require('../controllers/courses');
const Course = require('../models/course');
const router = express.Router();



// GET /courses/all-courses
router.get('/all-courses'
  ,isAuth
, coursesController.getUnfollowedCourses); //TESTED

router.get('/followed-courses'
  ,isAuth
, coursesController.getFollowedCourses); //TESTED
//PUT /courses/upload
router.put(//TESTED
    '/upload',
    [
        body('name')
        .trim()
        .not().isEmpty() 
        .custom((value,{req})=>{
            return Course.findOne({name:value}).then(courseDoc=>{
              if(courseDoc){
                return Promise.reject('Course is already exists.');
              }
            })
        })  
    ],
    coursesController.uploadCourse);
    // POST courses/search/key-word
router.post(
      '/search/key-word'
     // ,isAuth
    ,[ body('keyWord')]
      ,coursesController.searchByKeyWord);
module.exports = router;
