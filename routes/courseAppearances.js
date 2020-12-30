const express = require('express');
const { body } = require('express-validator');
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
    module.exports = router;
