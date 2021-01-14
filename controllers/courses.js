
const { validationResult } = require('express-validator');

const Course = require('../models/course');
const feedConstants = require('../constants/feed.json');
exports.uploadCourse =async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data=errors.array();
      next(error);
    }
    const name = req.body.name;
    const course = new Course({
        name: name
      });
    try{
      const result = await course.save();
      res.status(201).json({course: result });
    }catch(err){
        return next(err);
     }
};
exports.getCourses =async (req, res, next) => {
  const currentPage = req.query.page || 0;
  const perPage = feedConstants.NUM_OF_COURSES_FOLLOW_UP_PER_PAGE;
  try{
    const totalCount = await Course.find().countDocuments();
    const courses = await Course.find()
          .skip(currentPage * perPage)
          .limit(perPage);
      res
    .status(200)
    .json({courses: courses,totalItems:totalCount});
  }catch (err){
    next(err);
  }
};
exports.searchByKeyWord =async (req, res, next) => {
  const keyWord = req.body.keyWord;
  try{
      const searchResult = await Course.find({$text:{$search:keyWord}});
      if(!searchResult)
          throw new Error("there is no results");
      res.status(200).json({results:searchResult});
  }catch(err){    
      next(err);
  }
};
