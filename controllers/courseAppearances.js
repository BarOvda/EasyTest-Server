const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');
const User = require('../models/user');

exports.uploadCourseAppearance = async (req, res, next) => {
    const coresId = mongoose.Types.ObjectId(req.params.coresId);
    console.log(req.params.coresId);

    //const errors = validationResult(req);
    try {
        var course = await Course.findById(coresId);

        const name = req.body.name;
        console.log(Date.now());
        const examsDateA = new Date(req.body.examsDateA);
        const examsDateB = new Date(req.body.examsDateB);
        const duration = req.body.examDuration;
        const withMaterials = req.body.isExamWithMatearials;

        const courseAppearance = new CourseAppearance({
            name: name,
            couresId: coresId,
            exams: {
                exam: examsDateA,
                remake: examsDateB,
                withMaterials: withMaterials,
                duration: duration
            }
        })
        let result = await courseAppearance.save();

        course.appearances.push(result);

        console.log(req.params.coresId);
        await course.save();
        res.status(201).json({ appearances: result });
    } catch (err) {
        if (!err.statusCode)
            err.statusCode = 500;
        next(err);
    }



};
exports.deleteStudent = async (req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseAppId);
    const userId = mongoose.Types.ObjectId(q.body.userId);
    try {
        const course = await CourseAppearance.findById(courseId);
        const user = await User.findById(userId);

        if (!course || !user)
            throw new Error("invalid course or student");
        const index = course.students.indexOf(userId);

        course.students.foreach(element => {
            if (element.student == userId) {
                let index = course.students.indexOf(tuple);
                course.students.splice(index, 1);
                course.save();
            }
        })



        console.log(res);

        res.status(200).json("The student Deleted succesfuly.");
    } catch (err) {
        console.log(err);
        next(err);
    }

}

//TODO create exam directory with user and course details
exports.addStudent = async (req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseAppId);
    const userId = mongoose.Types.ObjectId(req.body.userId);
    try {
        const course = await CourseAppearance.findById(courseId);
        const user = await User.findById(userId);
        console.log(courseId);
        console.log(userId);
        if (!course || !user)
            throw new Error("invalid course or student");
        console.log("sdas");

        course.students.foreach(element => {
            if (element.student == userId)
                course.students.push(userId);
        });

        course.save();

        console.log(res);

        res.status(200).json("The student Added succesfuly.");
    } catch (err) {
        console.log(err);
        next(err);
    }
};
exports.getStudents = async (req, res, next) => {
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


exports.updateCourseApp = async (req, res, next) => { //TODO : Test
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
exports.deleteCourse = async (req, res, next) => { //TODO : Test
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