const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getUsers = async (req, res, next) => {
  try{
  const users = User.find();
  }catch (err){
    if (!err.statusCode) 
      err.statusCode = 500;
    next(err);
  }
      res
        .status(200)
        .json({users: users });
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
    const hashedPw =  bcrypt.hash(password,12);
    const result =  user.save();
    }catch(err){
      if (!err.statusCode) 
        err.statusCode = 500;     
      next(err);
    }    
  res.status(201).json({user: result});
}

exports.loginUser =async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  const user = User.findOne({email:email});
  if (!user) {
    const error = new Error('Could not find user.');
    error.statusCode = 401;
    throw error;
  }
  loadedUser = user;
  const isEqual = bcrypt.compare(password,user.password);  
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
};

exports.updateUser = (req, res, next) => { //TODO : Test
 // const password = req.body.password;
  let loadedUser;
  User.findById(req.body.userId)
    .then(user => {
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
  return loadedUser.update({
    password:loadedUser.password,
  email:loadedUser.email,
name:loadedUser.name});
    })
    .then(result => {
      res.status(200).json({ user: result });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

const clearImage = filePath => {
  filePath = path.join(__dirname, '..', filePath);
  fs.unlink(filePath, err => console.log(err));
};
