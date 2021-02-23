const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../auth/is-auth');
const coursesAppController = require('../controllers/courseAppearances');

const router = express.Router();

//PUT /course-appearances/upload
router.put(
    '/upload/:courseId',
    [
        body('name')
        .trim()
        .not().isEmpty() 
        ,
        
        body('examsDateA')
        ,
        body('examsDateB')
        //.isDate().withMessage("The date is not valid")
    ],
    coursesAppController.uploadCourseAppearance);
    //PUT /course-appearances/add-student/:courseAppId/:userId
router.put(
    '/add-student/:courseAppId',//TESTED ,TODO - add lecturer permissions
    isAuth
    ,coursesAppController.addStudent);
    
    module.exports = router;
