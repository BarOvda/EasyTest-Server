const express = require('express');
const { body } = require('express-validator');
const isAuth = require('../middlewares/IsAuth.middleware');
const usersController = require('../controllers/users');
const User = require('../models/user');
const router = express.Router();
const multer = require('multer');
const fileStorage = multer.diskStorage({
  // destination: (req, file, cb) => {
  //   cb(null, 'public/images');
  // },
  filename: (req, file, cb) => {
    cb(null, Date.now() + '-' + file.originalname.replace(/ /g, '_'));//replace all ' ' with '_'
  }
});

var upload = multer({ storage: fileStorage });


// GET /users/all-users
router.get('/all-users', usersController.getUsersDetails); //TESTED
// GET /users/all-users/pageination
router.get('/all-users/pageination', usersController.getUsers); //TESTED
// GET /users/directories
router.get('/directories', isAuth, usersController.getUserDirectories);//TODO
// PUT /users/sign-up
router.put( //TESTED 
  '/sign-up',
  upload.single('image'),
  [
    body('email')
      .isEmail().withMessage('Please enter a valid email')
      .custom((value, { req }) => {
        return User.findOne({ email: value }).then(userDoc => {
          if (userDoc) {
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

// POST /users/login
router.post('/login', //TESTED 
  [
    body('email')
      .isEmail().withMessage('Please enter a valid email'),
    body('password')
      .trim()
      .isLength({ min: 5 })
  ], usersController.loginUserToExam);
// PUT /users/update-details
router.put(//TESTED
  '/update-details',
  upload.single('image'),

  [
    body('password')
      .trim()
      .isLength({ min: 5 }),
    body('name')
      .trim()
  ], isAuth,
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

router.put( //TESTED
  '/unfollow-course/:courseId',
  isAuth,
  usersController.unFollowCourse
);
module.exports = router;
