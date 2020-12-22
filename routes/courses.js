const express = require('express');
const { body } = require('express-validator');
const coursesController = require('../controllers/courses');
const Course = require('../models/course');
const router = express.Router();

//PUT /courses/upload
router.put(
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
    module.exports = router;
