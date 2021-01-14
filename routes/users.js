const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../auth/is-auth');
const usersController = require('../controllers/users');
const User = require('../models/user');
const router = express.Router();
const multer = require('multer');
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, 'public/images');
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'));//replace all ' ' with '_'
  }
});

var upload = multer({ storage: fileStorage });



// GET /users/all-users
router.get('/all-users', usersController.getUsers); //TESTED
// GET /users/directories
//router.get('/directories/:userId', usersController.getUserDirectories);//TODO
// PUT /users/sign-up
router.put( //TESTED 
  '/sign-up',
  upload.single('image'),
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
router.post('/login', //TESTED 
  [
    body('email')
    .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ], usersController.loginUser);
// PUT /users/update-details
router.put(//TESTED
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
// GET /users/exam
router.get('/exam', //TESTED
  isAuth,
  usersController.getVailidExam);
  /// PUT users/follow-course/:courseId
  router.put( //TESTED
    '/follow-course/:courseId',
    isAuth,
    usersController.followCourse
  );


module.exports = router;
