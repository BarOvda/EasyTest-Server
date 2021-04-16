const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');
const User = require('../models/user');

exports.uploadCourseAppearance = async(req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseId);
    console.log(req.body.courseId);

    const errors = validationResult(req);
    try {
        const course = await Course.findById(courseId);
    } catch (error) { //TODO check invalid courseId
        if (!course) {
            error.messege = 'course not found.';
            error.statusCode = 422;
            error.data = errors.array();
            next(error);
        }
    }
    const name = req.body.name;
    console.log(Date.now());
    const examsDateA = new Date(req.body.examsDateA);
    const examsDateB = new Date(req.body.examsDateB);
    const duration = req.body.examDuration;
    const withMaterials = req.body.isExamWithMatearials;

    const courseAppearance = new CourseAppearance({
        name: name,
        courseId: courseId,
        exams: {
            exam: examsDateA,
            remake: examsDateB,
            withMaterials: withMaterials,
            duration: duration
        }
    })
    try {
        let result = await courseAppearance.save();
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }
    course.appearances.push(result);
    try {
        result = await course.save();
        res.status(201).json({ user: result });
    } catch (err) {
        next(err);
    }
};
exports.deleteStudent = async(req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseAppId);
    const userId = req.body.userId;
    try {
        const course = await CourseAppearance.findById(courseId);
        const user = await User.findById(userId);

        if (!course || !user)
            throw new Error("invalid course or student");
        const index = course.students.indexOf(userId);


        if (index > -1) {
            course.students.splice(index, 1);
            course.save();

        }

        console.log(res);

        res.status(200).json("The student Deleted succesfuly.");
    } catch (err) {
        console.log(err);
        next(err);
    }

}

//TODO create exam directory with user and course details
exports.addStudent = async(req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseAppId);
    const userId = req.body.userId;
    try {
        const course = await CourseAppearance.findById(courseId);
        const user = await User.findById(userId);
        console.log(courseId);
        console.log(userId);
        if (!course || !user)
            throw new Error("invalid course or student");
        console.log("sdas");

        if (course.students.indexOf(userId) === -1)
            course.students.push(userId);
        course.save();

        console.log(res);

        res.status(200).json("The student Added succesfuly.");
    } catch (err) {
        console.log(err);
        next(err);
    }
};
exports.getStudents = async(req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseAppId);

    try {
        const course = await CourseAppearance.findById(courseId);

        if (!course)
            throw new Error("invalid course");

        res.status(200).json({ students: course.students });
    } catch (err) {
        console.log(err);
        next(err);
    }
};


exports.updateCourseApp = async(req, res, next) => { //TODO : Test
    let loadedCourse;
    const courseId = req.params.courseAppId;
    try {
        const course = await CourseAppearance.findById(courseId);
        if (!course) {
            const error = new Error('Could not find the course.');
            error.statusCode = 401;
            throw error;
        }

        loadedCourse = course;
        if (req.body.name) loadedCourse.name = req.body.name;
        if (req.body.examsDateA) loadedCourse.exams.exam = req.body.examsDateA;
        if (req.body.examsDateB) loadedCourse.exams.remake = req.body.examsDateB;
        if (req.body.isExamWithMatearials) loadedCourse.exams.withMaterials = req.body.isExamWithMatearials;
        if (req.body.examDuration) loadedCourse.exams.duration = req.body.examDuration;

        const result = await loadedCourse.save();
        console.log(result);
        res.status(200).json({ course: result });
    } catch (err) {

        next(err);
    }
};
exports.deleteCourse = async(req, res, next) => { //TODO : Test
    const courseId = req.params.courseId;
    try {
        const course = await CourseAppearance.findByIdAndDelete(courseId);
        if (!course) {
            const error = new Error('Could not find the course.');
            error.statusCode = 401;
            throw error;
        }

        res.status(200).json({ course: course });
    } catch (err) {
        next(err);
    }
};