const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../auth/is-auth');
const usersController = require('../controllers/users');
const User = require('../models/user');
const router = express.Router();

// GET /users/all-users
router.get('/all-users', usersController.getUsers);
// GET /users/directories
//router.get('/directories/:userId', usersController.getUserDirectories);//TODO
// PUT /users/sign-up
router.put(
  '/sign-up',
  //TODO : AUTHENTICATION
  [
    body('email')
    .isEmail().withMessage('Please enter a valid email')
      .custom((value,{req})=>{
          return User.findOne({email:value}).then(userDoc=>{
            if(userDoc){
              return Promise.reject('Email addres already exists.');
            }
          })
      }).normalizeEmail(),
    body('password')
      .trim()
      .isLength({ min: 5 }),
      body('name')
      .trim()
      .not().isEmpty()
      
  ],
  usersController.createUser
);
// GET /users/login
router.get('/login',
  //TODO : AUTHENTICATION
  [
    body('email')
    .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ], usersController.loginUser);
// PUT /users/update-details
router.put(
  '/update-details',
  [
    body('email')
    .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .trim()
      .isLength({ min: 5 }),
      body('name')
      .trim()
      .not().isEmpty()
      
  ],isAuth,
  usersController.updateUser
);



module.exports = router;
