const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');

exports.uploadCourseAppearance = (req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.body.courseId);
    console.log(req.body.courseId);

    const errors = validationResult(req);
    Course.findById(courseId).then(course=>{
      console.log(course);
        if(!course){
            const error = new Error('course not found.');
            error.statusCode = 422;
            error.data=errors.array();
            throw error;
        }
    const name = req.body.name;
    const examsDateA = new Date(req.body.examsDateA);
    const examsDateB = new Date(req.body.examsDateB);
    const courseAppearance = new CourseAppearance({
        name :name,
        courseId:courseId,
        examsDateA:examsDateA,
        examsDateB:examsDateB
    })
    return courseAppearance.save()
    .catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);})
    .then(result => {
      course.appearances.push(result);
      course.save().then(result=>{
        res.status(201).json({
          user: result
        });
      })
    })
    })

}