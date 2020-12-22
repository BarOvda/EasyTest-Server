const express = require('express');
const { body } = require('express-validator');
const coursesAppController = require('../controllers/courseAppearances');

const router = express.Router();

//PUT /course-appearances/upload
router.put(
    '/upload',
    [
        body('name')
        .trim()
        .not().isEmpty() 
        ,
        body('courseId')
        .not().isEmpty(),
        body('examsDateA')
        .isDate().withMessage("The date is not valid"),
        body('examsDateB')
        .isDate().withMessage("The date is not valid")
    ],
    coursesAppController.uploadCourseAppearance);
    module.exports = router;
