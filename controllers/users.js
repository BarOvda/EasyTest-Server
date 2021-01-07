const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dateUtils = require('../utils/dates'); 
const CourseAppearance = require('../models/courseAppearance'); 
const examConstants =  require('../constants/exam-constants.json'); 
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const userConstants = require('../constants/users.json');

exports.getUsers = async (req, res, next) => {
  const currentPage = req.query.page || 0;
  const perPage = 10;
  try{
    const totalCount = await User.find().countDocuments();
    const users = await User.find()
          .skip(currentPage * perPage)
          .limit(perPage);

      res
    .status(200)
    .json({users: users,totalItems:totalCount});
  }catch (err){
    next(err);
  }
      
};

exports.createUser = async(req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data=errors.array();
    next(error);
  }
  let imageUrl;
  if (!req.file) {
    imageUrl = userConstants["PATH"];
  }else{
    imageUrl=req.file.path;
  }  
  const email = req.body.email;
  const name = req.body.name;
  const password = await bcrypt.hash(req.body.password,12);
  const user = new User({
    email: email,
    name: name,
    imageUrl: imageUrl,
    password:password
  });
  try{
    const result = await user.save();
    res.status(201).json({user: result});

    }catch(err){
      next(err);
    }    

};

exports.loginUser =async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  
  let loadedUser;
  try{
  const user = await User.findOne({email:email});
  if (!user) {
    const error = new Error('Could not find user.');
    error.statusCode = 401;
    throw error;
  }
  loadedUser = user;

  const isEqual = await bcrypt.compare(password,user.password);  
  if(!isEqual){
    const error = new Error('Incorrect password.');
    error.statusCode = 401;
    throw error;
  }
  const token = webToken.sign({
      email:loadedUser.email,
      userId:loadedUser._id.toString()
    }
    ,userConstants.HASH_KEY_CODE
    ,
    {expiresIn:'4h'}
    );
    res.status(200).json({token:token, userId:loadedUser._id.toString()});
  }catch(err){
    next(err);
  }
};

exports.updateUser = async (req, res, next) => { //TODO : Test
 // const password = req.body.password;
  let loadedUser;
  try{
    const user = await User.findById(req.userId);
    if (!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 401;
        throw error;
      }
  loadedUser = user;
  console.log(loadedUser);
  if(req.body.name) loadedUser.name = req.body.name;
  if(req.body.email) loadedUser.email = req.body.email;
  if(req.body.password) loadedUser.password = req.body.password;
  // let imageUrl;
  // if (req.file)
  // {
  //   imageUrl = req.body.image;
  //   imageUrl = req.file.path;
  //   loadedUser.imageUrl = req.file.path;
  // }
  const result = await loadedUser.save();
    
    res.status(200).json({ user: result });
    }catch(err){
      
      next(err);
  }
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};

exports.getVailidExam = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  

  const currentDate = new Date();
  //console.log(currentDate);
  const upperDateLimit = dateUtils.addMinutes(currentDate,examConstants['NUM-OF-MAXIMUM-MINUTS-AFTER-EXAM-TO-LOGIN']);
  const lowerDateLimit = dateUtils.addMinutes(currentDate,examConstants['NUM-OF-MAXIMUM-MINUTS-BEFOR-EXAM-TO-LOGIN']);
  //console.log(upperDateLimit);

  try{
   const course = await CourseAppearance.findOne({
   $or:[{
    $and: [
      {examsDateA:{$lte:upperDateLimit} },
      {examsDateA:{$gte:lowerDateLimit} },
        {students:userId}
      ]
    },{$and: [
        {examsDateB:{$lte:upperDateLimit} },
        {examsDateB:{$gte:lowerDateLimit} },
          {students:userId}
    ]}]
      });
      console.log(course);
      if(!course)
        throw new Error("There is not valid course");
      console.log(course);

      const directory = await ExamDirectory.findOne({owner:userId,courseId:course._id})
      .populate("summaries");
      if(!directory)
        throw new Error("There is not directory for this student in this course");
        
     res.status(200).json({directory:directory,course:course});
  }catch(err){
    next(err);
  }
}
exports.followCourse = async (req, res, next) => {
  const userId = req.userId;
  const courseId = req.params.courseId;
  try{
    let user = await User.findById(userId);
    if(user.followedCourses.indexOf(courseId)===-1)
      user.followedCourses.push(courseId);
    user = await user.save();
    res.status(201).json({user:user});
  }catch(err){
    next(err);
  }
}

