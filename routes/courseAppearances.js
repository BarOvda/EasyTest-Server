const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/IsAuth.middleware');
const coursesAppController = require('../controllers/courseAppearances');
const ExamDirController = require('../controllers/examDirectories');

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
], coursesAppController.addStudent, ExamDirController.createDirectory);

//PUT /course-appearances/delete-student/:courseAppId
router.put(
    '/delete-student/:courseAppId', //TESTED ,TODO - add admin permissions
    isAuth, body('userId'), coursesAppController.deleteStudent);

//GET /course-appearances/students/:courseAppId
router.get(
    '/students/:courseAppId', //TODO -test
     coursesAppController.getStudents);
//GET /course-appearances/students/report/:courseAppId

router.get(
    '/students/report/:courseAppId', //TODO -test
    isAuth, coursesAppController.getReport);
//GET /course-appearances/all
router.get(
    '/all', //TODO -test
    coursesAppController.getAll);
    // isAuth
module.exports = router;