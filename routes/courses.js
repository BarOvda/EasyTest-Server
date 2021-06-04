const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/IsAuth.middleware');
const coursesController = require('../controllers/courses');
const Course = require('../models/course');
const router = express.Router();


// GET /courses/all
router.get('/all', isAuth, coursesController.getAllCourses); //TESTED

// GET /courses/all-appearances
router.get('/all-appearances/:courseId', coursesController.getAllCourseAppearances); //TESTED
// GET /courses/allcourses
router.get('/allcourses', isAuth, coursesController.getUnfollowedCourses); //TESTED

router.get('/followed-courses', isAuth, coursesController.getFollowedCourses); //TESTED
//PUT /courses/upload
router.put( //TESTED
    '/upload', [
        body('name')
        .trim()
        .not().isEmpty()
        .custom((value, { req }) => {
            return Course.findOne({ name: value }).then(courseDoc => {
                if (courseDoc) {
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
    , [body('keyWord')], coursesController.searchByKeyWord);

// PUT /courses/update-details
router.put( //TESTED
    '/update-details/:courseId', [
        body('name')
        .trim()
    ], isAuth,
    coursesController.updateCourse
);

// DELETE /courses/:courseId
router.delete('/:courseId', coursesController.deleteCourse); //TESTED



// DELETE /courses/appearance/
router.delete('/appearance', [body('appId').trim()], coursesController.deleteAppearance); //TESTED
module.exports = router;