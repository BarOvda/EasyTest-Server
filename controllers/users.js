const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');


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
  //what req.file means?
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    next(error);
  }
  console.log(req.body);
  console.log(req.file.path);


  const imageUrl=req.file.path;
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  const user = new User({
    email: email,
    name: name,
    imageUrl: imageUrl,
    password:password
  });
  try{
    //const hashedPw = await bcrypt.hash(password,12);
    const result = await user.save();
    res.status(201).json({user: result});

    }catch(err){
      next(err);
    }    

};

exports.loginUser =async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  console.log(password);
  let loadedUser;
  try{
  const user = await User.findOne({email:email});
  if (!user) {
    const error = new Error('Could not find user.');
    error.statusCode = 401;
    next(error);
  }
  loadedUser = user;

  const isEqual = password===user.password;//await bcrypt.compare(password,user.password);  
  if(!isEqual){
    const error = new Error('Incorrect password.');
    error.statusCode = 401;
    next(error);
  }
  const token = webToken.sign({
      email:loadedUser.email,
      userId:loadedUser._id.toString()
    }
    ,'somesupersecret',//known only by the server
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
  //const userId = req.userId;
  console.log('examDirectory');
  try{
   const directories = await ExamDirectory.find()//.lte(Date.now())
   .populate('courseId'
   , null, 
   { examsDateA: { $gte:new Date('2020-12-23T22:00:00.000Z') }}, { limit: 5 });
    directories.forEach(directory=>{
      if(!directory.courseId)
          directories.unshift(directory);
    })
   console.log(directories);
   //console.log(directory);
      res.status(200).json({directory:directories});
  }catch(err){
    next(err);
  }
}

