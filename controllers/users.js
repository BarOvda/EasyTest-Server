const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const User = require('../models/user');

exports.getUsers = (req, res, next) => {
  User.find()
    .then(users => {
      res
        .status(200)
        .json({users: users });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.createUser = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data=errors.array();
    throw error;
  }
  //what req.file means?
  if (!req.file) {
    const error = new Error('No image provided.');
    error.statusCode = 422;
    throw error;
  }
  console.log("middle");
  const imageUrl=req.file.path;
  const email = req.body.email;
  const name = req.body.name;
  const password = req.body.password;
  bcrypt.hash(password,12).then(hashedPw=>{
    const user = new User({
      email: email,
      name: name,
      imageUrl: imageUrl,
      password:password
    });
    return user.save()
  }).catch(err => {
    if (!err.statusCode) {
      err.statusCode = 500;
    }
    next(err);})
    .then(result => {
      res.status(201).json({
        user: result
      });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.loginUser = (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  User.findOne({email:email})
    .then(user => {
      if (!user) {
        const error = new Error('Could not find user.');
        error.statusCode = 401;
        throw error;
      }
      loadedUser = user;
      console.log(user.password);
      console.log(password);
     return bcrypt.compare(password,user.password);
    }).then(isEqual=>{
      // if(!isEqual){
      //   const error = new Error('Incorrect password.');
      //   error.statusCode = 401;
      //   throw error
      // }
      const token = webToken.sign({
        email:loadedUser.email,
        userId:loadedUser._id.toString()

      }
      ,'somesupersecret',//known only by the server
      {expiresIn:'4h'}
      
      );
      res.status(200).json({token:token, userId:loadedUser._id.toString()})
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.updateUser = (req, res, next) => {
  const email = req.body.email;
 // const password = req.body.password;
  let loadedUser;
  User.findOne({email:email})
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
  let imageUrl;
  if (req.file)
  {
    imageUrl = req.body.image;
    imageUrl = req.file.path;
    loadedUser.imageUrl = req.file.path;
  }
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
