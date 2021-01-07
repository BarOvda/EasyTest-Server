
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');
const User = require('../models/user');


exports.uploadCourseAppearance =async (req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseId);
    console.log(req.body.courseId);

    const errors = validationResult(req);
    try{
    const course= await Course.findById(courseId);
    }catch (error){//TODO check invalid courseId
      if(!course){
        error.messege = 'course not found.';
        error.statusCode = 422;
        error.data=errors.array();
        next(error);
      }
    }
    const name = req.body.name;
    console.log(Date.now());
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
       res.status(201).json({user: result});
    }catch(err){
      next(err);
    } 
};
exports.addStudent =async (req, res, next) => {
  const courseId = mongoose.Types.ObjectId(req.params.courseAppId);
  const userId = mongoose.Types.ObjectId(req.params.userId);
  try{
  const course =await CourseAppearance.findById(courseId);
  const user =await User.findById(userId);
  console.log(courseId);
  console.log(userId);
  if(!course||!user)
    throw new Error("invalid course or student");
  console.log("sdas");

  if(course.students.indexOf(userId)===-1)
    course.students.push(userId);
  course.save();

  console.log(res);

  res.status(200).json("The student Added succesfuly.");
  }catch(err){
    console.log(err);
    next(err);
  }
};
