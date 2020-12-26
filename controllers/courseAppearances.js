const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');

exports.uploadCourseAppearance =async (req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.body.courseId);
    console.log(req.body.courseId);

    const errors = validationResult(req);
    try{
    const course= await Course.findById(courseId);
    }catch (error){
      if(!course){
        error.messege = 'course not found.';
        error.statusCode = 422;
        error.data=errors.array();
        next(error);
      }
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
    try{
      let result = await courseAppearance.save();
    }catch(err){
      if (!err.statusCode) 
        err.statusCode = 500;
      next(err);
    }
    course.appearances.push(result);
    try{
       result = await course.save();
    }catch(err){
      if (!err.statusCode)
        err.statusCode = 500;
      next(err);
    }
      res.status(201).json({
        user: result
      });
      
}