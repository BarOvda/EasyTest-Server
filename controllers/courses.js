
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
exports.getUnfollowedCourses =async (req, res, next) => {
  const userId = req.userId;
  const currentPage = (+req.query.page || 1) - 1;
  const perPage = +req.query.per_page;
  console.log(userId);
  try{
    const totalCount = await Course.find({"followers": { "$ne":userId }}).countDocuments();
    
    const courses = await Course.find({"followers": { "$ne":userId }})
          .skip(currentPage * perPage)
          .limit(perPage);
      res
    .status(200)
    
    .json({courses: courses,items_per_page:perPage,current_page:currentPage+1,total_items:totalCount});
  }catch (err){
    next(err);
  }
};
exports.getFollowedCourses =async (req, res, next) => {
  const userId = req.userId;
  const currentPage = (+req.query.page || 1) - 1;
  const perPage = +req.query.per_page;
  console.log(userId);
  try{
    const totalCount = await Course.find({"followers": { "$in":userId }}).countDocuments();
    
    const courses = await Course.find({"followers": { "$in":userId }})
          .skip(currentPage * perPage)
          .limit(perPage);
      res
    .status(200)
    
    .json({courses: courses,items_per_page:perPage,current_page:currentPage+1,total_items:totalCount});
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
