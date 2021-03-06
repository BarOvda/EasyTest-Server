const mongoose = require('mongoose');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const dateUtils = require('../utils/dates');
const CourseAppearance = require('../models/courseAppearance');
const Course = require('../models/course');
const examConstants = require('../constants/exam-constants.json');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const userConstants = require('../constants/users.json');
const awsAPI = require('../helpers/awsAPI');
const { use } = require('../routes/feed');


exports.getUsersDetails = async (req, res, next) => {
  try {
    const users = await User.find();
    res.status(200).json({ users: users });
  } catch (err) {
    next(err);
  }
}
exports.getUsers = async (req, res, next) => {
  const currentPage = req.query.page || 0;
  const perPage = 10;
  try {
    const totalCount = await User.find().countDocuments();
    const users = await User.find()
      .skip(currentPage * perPage)
      .limit(perPage);

    res
      .status(200)
      .json({ users: users, totalItems: totalCount });
  } catch (err) {
    next(err);
  }

};

exports.createUser = async (req, res, next) => {
  //console.log(req.file);
  const folder = 'images';

  const errors = validationResult(req);

  if (!errors.isEmpty()) {


    const error = new Error(errors.array()[0].msg);
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  } else {


    let imageUrl;

    if (!req.file) {
      imageUrl = userConstants["PATH"];
    } else {

      let fileNameUpload = req.file.filename;
      // Enter the file you want to upload here
      let only_name = fileNameUpload.split(".")[0]
      awsAPI.uploadFile(req.file, 'images');
      imageUrl = `https://easy-test-s3.s3.amazonaws.com/${folder}/${only_name}`;
    }
    const email = req.body.email;
    const name = req.body.name;
    const role = req.body.role || "USER";
    const password = await bcrypt.hash(req.body.password, 12);
    const user = new User({
      email: email,
      name: name,
      imageUrl: imageUrl,
      password: password,
      role: role
    });
    try {
      const result = await user.save();

      const token = webToken.sign({
        email: result.email,
        userId: result._id.toString()
      }
        , userConstants.HASH_KEY_CODE
        //,{expiresIn:'6h'}
      );
      res.status(201).json({ token: token, user: result });

    } catch (err) {
      next(err);
    }
  }

};
exports.logoutUser = async (req, res, next) => {
  const userId = req.userId;
  const courseAppId = mongoose.Types.ObjectId(req.body.courseAppId);

  try {
    const user = await User.findById(userId);

    if (courseAppId) {

      let course = await CourseAppearance.findById(courseAppId);
      course.students.forEach(element => {
        if (element.student.toString() == user._id.toString()) {

          element.loggedIn = 'false';
        }

      });
      await course.save();

      res.status(201).json({ message: "Logout succesfully" });
    }

  } catch (err) {
    next(err);
  }
}
exports.loginUserAdminPanel = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {

    const user = await User.findOne({ email: email }).populate({
      path: 'examsDirectories',
      populate: {
        path: 'courseId',
        populate: 'couresId'}
      }).populate("followedCourses");

    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Incorrect password.');
      error.statusCode = 401;
      throw error;
    }
    const token = webToken.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }
      , userConstants.HASH_KEY_CODE
      , { expiresIn: '6h' }
    );
    let courseAppId;
    if (req.body.courseAppId) courseAppId = mongoose.Types.ObjectId(req.body.courseAppId);
    if (courseAppId) {

      let course = await CourseAppearance.findById(courseAppId);
      course.students.forEach(element => {
        if (element.student.toString() == user._id.toString()) {

          if (element.loggedIn.toString() == 'true') {
            const error = new Error('already logedIn');
            error.statusCode = 500;
            throw error;
          } else {
            element.loggedIn = 'true';
            element.loginCounts = element.loginCounts + 1;
            element.loginDates.push(Date.now())
          }
        }
      });

      await course.save();

    }

    res.status(200).json({ token: token, user: user, userId: loadedUser._id.toString() });
  } catch (err) {
    next(err);
  }

}
exports.loginUserExam = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {

    const user = await User.findOne({ email: email }).populate({
      path: 'examsDirectories',
      populate: {
        path: 'courseId',
        populate: 'couresId'}
      }).populate("followedCourses");

    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Incorrect password.');
      error.statusCode = 401;
      throw error;
    }
    const token = webToken.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }
      , userConstants.HASH_KEY_CODE
      , { expiresIn: '6h' }
    );
    let courseAppId;
    if (req.body.courseAppId) courseAppId = mongoose.Types.ObjectId(req.body.courseAppId);
    if (courseAppId) {

      let course = await CourseAppearance.findById(courseAppId);
      course.students.forEach(element => {
        if (element.student.toString() == user._id.toString()) {

          if (element.loggedIn.toString() == 'true') {
            const error = new Error('already logedIn');
            error.statusCode = 500;
            throw error;
          } else {
            element.loggedIn = 'true';
            element.loginCounts = element.loginCounts + 1;
            element.loginDates.push(Date.now())
          }
        }
      });

      await course.save();

    }

    res.status(200).json({ token: token, user: user, userId: loadedUser._id.toString() });
  } catch (err) {
    next(err);
  }

}

exports.loginUser = async (req, res, next) => {
  const email = req.body.email;
  const password = req.body.password;
  let loadedUser;
  try {

    const user = await User.findOne({ email: email }).populate({
      path: 'examsDirectories',
      populate: {
        path: 'courseId',
        populate: 'couresId'}
      }).populate("followedCourses");

    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    const isEqual = await bcrypt.compare(password, user.password);
    if (!isEqual) {
      const error = new Error('Incorrect password.');
      error.statusCode = 401;
      throw error;
    }
    const token = webToken.sign({
      email: loadedUser.email,
      userId: loadedUser._id.toString()
    }
      , userConstants.HASH_KEY_CODE
      , { expiresIn: '6h' }
    );
    let courseAppId;
    if (req.body.courseAppId) courseAppId = mongoose.Types.ObjectId(req.body.courseAppId);
    if (courseAppId) {

      let course = await CourseAppearance.findById(courseAppId);
      course.students.forEach(element => {
        if (element.student.toString() == user._id.toString()) {

          if (element.loggedIn.toString() == 'true') {
            const error = new Error('already logedIn');
            error.statusCode = 500;
            throw error;
          } else {
            element.loggedIn = 'true';
            element.loginCounts = element.loginCounts + 1;
            element.loginDates.push(Date.now())
          }
        }
      });

      await course.save();

    }

    res.status(200).json({ token: token, user: user, userId: loadedUser._id.toString() });
  } catch (err) {
    next(err);
  }
};

exports.updateUser = async (req, res, next) => { //TODO : Test
  // const password = req.body.password;
  let loadedUser;
  const folder = 'images';
  console.log(req.body);
  try {
    const user = await User.findById(req.userId);
    if (!user) {
      const error = new Error('Could not find user.');
      error.statusCode = 401;
      throw error;
    }
    loadedUser = user;
    // if (req.body.name) loadedUser.name = req.body.name;
    // if (req.body.password) {
    //   const password = await bcrypt.hash(req.body.password, 12);

    //   loadedUser.password = password;
    // }
    let imageUrl;
    if (req.file) {
      console.log("file");
      let fileNameUpload = req.file.filename;
      let only_name = fileNameUpload.split(".")[0];
      awsAPI.uploadFile(req.file, `images`);
      imageUrl = `https://easy-test-s3.s3.amazonaws.com/${folder}/${only_name}`;
      loadedUser.imageUrl = imageUrl;
    }
    const result = await loadedUser.save();
    console.log(result);
    res.status(200).json({ user: result });
  } catch (err) {

    next(err);
  }
};


exports.getVailidExam = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  const currentDate = new Date();

  const upperDateLimit = dateUtils.addMinutes(currentDate, examConstants['NUM-OF-MAXIMUM-MINUTS-AFTER-EXAM-TO-LOGIN']);
  const lowerDateLimit = dateUtils.addMinutes(currentDate, examConstants['NUM-OF-MAXIMUM-MINUTS-BEFOR-EXAM-TO-LOGIN']);
  console.log(currentDate);

  try {
    const course = await CourseAppearance.findOne({
      $or: [{
        $and: [
          { "exams.exam": { $lte: upperDateLimit } },
          { "exams.exam": { $gte: lowerDateLimit } },
          { "students.student": userId }
        ]
      }, {
        $and: [
          { "exams.remake": { $lte: upperDateLimit } },
          { "exams.remake": { $gte: lowerDateLimit } },
          { "students.student": userId }
        ]
      }]
    });
    // console.log(course);
    if (!course)
      throw new Error("There is not valid course");

    const directory = await ExamDirectory.findOne({ owner: userId, courseId: course._id })
      .populate("summaries");
    console.log(directory);

    if (!directory)
      throw new Error("There is not directory for this student in this course");




    res.status(200).json({ directory: directory, course: course });
  } catch (err) {
    next(err);
  }
}
exports.followCourse = async (req, res, next) => {
  console.log('request added');
  const userId = req.userId;
  const courseId = req.params.courseId;
  try {
    let user = await User.findById(userId);
    let course = await Course.findById(courseId);
    if (user.followedCourses.indexOf(courseId) === -1) {
      user.followedCourses.push(courseId);
      course.followers.push(userId);
    }
    user = await user.save();
    course = await course.save();
    user = await User.findById(userId).populate("followedCourses");

    res.status(201).json({ user: user });
  } catch (err) {
    next(err);
  }
}

exports.unFollowCourse = async (req, res, next) => {

  const userId = req.userId;
  const courseId = req.params.courseId;
  try {
    let user = await User.findById(userId);
    let course = await Course.findById(courseId);
    if (user.followedCourses.indexOf(courseId) != -1) {
      const courseIndex = user.followedCourses.indexOf(courseId, 0);
      const userIndex = course.followers.indexOf(userId, 0);
      console.log(courseIndex);

      user.followedCourses.splice(courseIndex, 1);
      course.followers.splice(userIndex, 1);
    }
    console.log(user.followCourse);
    user = await user.save();
    course = await course.save();
    user = await User.findById(userId).populate("followedCourses");

    res.status(201).json({ user: user });
  } catch (err) {
    next(err);
  }
}

exports.getUserDirectories = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const user = await User.findById(userId).populate({
      path: 'examsDirectories',
      populate: {
        path: 'courseId',
        populate: 'couresId'

      }
    });
    if (!user) {
      throw new Error("user not exist");
    }

    const examDirectories = user.examsDirectories;

    res.status(201).json({ exam_direcoties: examDirectories });

  } catch (err) {
    next(err);

  }

}

exports.getUsersFromMoodleApi = async (req, res, next) => {

};


