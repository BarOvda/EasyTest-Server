
const { validationResult } = require('express-validator');

const Course = require('../models/course');
const feedConstants = require('../constants/feed.json');
const courseAppearance = require('../models/courseAppearance');
exports.uploadCourse = async (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    const error = new Error('Validation failed.');
    error.statusCode = 422;
    error.data = errors.array();
    next(error);
  }
  const name = req.body.name;
  const course = new Course({
    name: name
  });
  try {
    const result = await course.save();
    res.status(201).json({ course: result });
  } catch (err) {
    return next(err);
  }
};
exports.getUnfollowedCourses = async (req, res, next) => {
  console.log("here");

  const userId = req.userId;

  const currentPage = (+req.query.page || 1) - 1;
  const perPage = +req.query.per_page;
  try {
    const totalCount = await Course.find({ "followers": { "$ne": userId } }).countDocuments();

    const courses = await Course.find({ "followers": { "$ne": userId } })
      .skip(currentPage * perPage)
      .limit(perPage);
    console.log(courses);

    res
      .status(200)

      .json({ courses: courses, items_per_page: perPage, current_page: currentPage + 1, total_items: totalCount });
  } catch (err) {

    next(err);
  }
};
exports.getFollowedCourses = async (req, res, next) => {
  const userId = req.userId;
  const currentPage = (+req.query.page || 1) - 1;
  const perPage = +req.query.per_page;
  console.log(userId);
  try {
    const totalCount = await Course.find({ "followers": { "$in": userId } }).countDocuments();

    const courses = await Course.find({ "followers": { "$in": userId } })
      .skip(currentPage * perPage)
      .limit(perPage);
    res
      .status(200)

      .json({ courses: courses, items_per_page: perPage, current_page: currentPage + 1, total_items: totalCount });
  } catch (err) {
    next(err);
  }
};
exports.getAllCourses = async (req, res, next) => {
  const userId = req.userId;

  try {
    const courses = await Course.find()
    res.status(200).json({ courses: courses });
  } catch (err) {
    next(err);
  }
};
exports.searchByKeyWord = async (req, res, next) => {

  const keyWord = req.body.keyWord;
  console.log(keyWord);
  //const userId = req.userId;
  const currentPage = (+req.query.page || 1) - 1;
  const perPage = +req.query.per_page || 2;

  try {
    const totalCount = await Course.find({ $text: { $search: keyWord } }).countDocuments();
    console.log(totalCount);
    const searchResult = await Course.find({ $text: { $search: keyWord } })
      .skip(currentPage * perPage)
      .limit(perPage);

    if (!searchResult)
      throw new Error("there is no results");
    res.status(200).json({ results: searchResult, items_per_page: perPage, current_page: currentPage + 1, total_items: totalCount });
  } catch (err) {
    next(err);
  }
};
exports.getAllCourseAppearances = async (req, res, next) => {
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId).populate('appearances');
    console.log(course);
    const appearances = course.appearances;
    console.log(appearances);
    res.status(200).json({ appearances: appearances });
  } catch (err) {
    next(err);
  }
};



exports.updateCourse = async (req, res, next) => { //TODO : Test
  let loadedCourse;
  const courseId = req.params.courseId;
  try {
    const course = await Course.findById(courseId);
    if (!course) {
      const error = new Error('Could not find the course.');
      error.statusCode = 401;
      throw error;
    }
    loadedCourse = course;
    if (req.body.name) loadedCourse.name = req.body.name;

    const result = await loadedCourse.save();
    console.log(result);
    res.status(200).json({ course: result });
  } catch (err) {

    next(err);
  }
};

exports.deleteCourse = async (req, res, next) => { //TODO : Test
  const courseId = req.params.courseId;
  try {
    const course = await Course.findByIdAndDelete(courseId);
    if (!course) {
      const error = new Error('Could not find the course.');
      error.statusCode = 401;
      throw error;
    }
    // course.appearances.forEach(element => {
    //   await courseAppearance.findByIdAndDelete(element._id);
    // });
    res.status(200).json({ course: course });
  } catch (err) {
    next(err);
  }
};
