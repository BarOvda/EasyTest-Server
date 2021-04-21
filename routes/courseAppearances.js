const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../auth/is-auth');
const coursesAppController = require('../controllers/courseAppearances');

const router = express.Router();

//PUT /course-appearances/upload/:courseId
router.put(
    '/upload/:coresId', [
        body('name')
        .trim()
        .not().isEmpty(),
        body('examDuration'),
        body('isExamWithMatearials'),
        body('examsDateA'),
        body('examsDateB')
        //.isDate().withMessage("The date is not valid")
    ],
    coursesAppController.uploadCourseAppearance);

//PUT /course-appearances/update/:id
router.put(
    '/update/:courseAppId', [
        body('name')
        .trim()
        .not().isEmpty(),
        body('examDuration'),
        body('isExamWithMatearials'),
        body('examsDateA'),
        body('examsDateB')
        //.isDate().withMessage("The date is not valid")
    ],
    coursesAppController.updateCourseApp);

//PUT /course-appearances/add-student/:courseAppId
router.put(
    '/add-student/:courseAppId', //TESTED ,TODO - add admin permissions
    isAuth, [
        body('userId')
    ], coursesAppController.addStudent);

//PUT /delete-student/:courseAppId
router.put(
    '/delete-student/:courseAppId', //TESTED ,TODO - add admin permissions
    isAuth, coursesAppController.deleteStudent);

//GET /course-appearances/students/:courseAppId
router.get(
    '/students/:courseAppId', //TODO -test
    isAuth, coursesAppController.getStudents);


module.exports = router;