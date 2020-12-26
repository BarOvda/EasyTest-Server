const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const CourseAppearance = require('../models/courseAppearance');
const Summary = require('../models/summary');


exports.createDirectory = async(req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseId);
    const ownerId = req.body.userId;    
    try{
      const courseExists = await CourseAppearance.exists({_id:courseId});
      const userExists = await User.findById(ownerId);
    }catch(err){
      if (!err.statusCode) 
        err.statusCode = 500;
      next(err);
    }

    if(!userExists||!courseExists){
        const error = new Error('Validation failed.');
        error.statusCode = 422;
        error.data=errors.array();
        next(error);
    }
    const examDirectory = new ExamDirectory({
        owner:ownerId,
        courseId:courseId
    })
    const directory = await examDirectory.save();
    userExists.examsDirectories.push(directory);
    const userRes = await userExists.save();
    res.status(201).json({directory: directory,user:userRes});                
};



exports.getDirectory = async (req, res, next) => {
    const directoryId = mongoose.Types.ObjectId(req.params.directoryId);
    try{
    const directory = await ExamDirectory.findById(directoryId);
    }catch(err){
      if (!err.statusCode) 
        err.statusCode = 500;
      next(err);
    }
      res
        .status(200)
        .json({directory: directory });
};

exports.addFileToDirectory = async (req, res, next) => {
    const directoryId = mongoose.Types.ObjectId(req.params.directoryId);  
    
    
    const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
    const IsSummaryExists = await Summary.exists({_id:summaryId});
    const directory = await ExamDirectory.findById(directoryId);
    if(!IsSummaryExists){
      const error = new Error('The summary does not exists.');
      error.statusCode = 401;
      error.data=errors.array();
      next(error);    }
    if(!directory){
      const error = new Error('The directory does not exists.');
      error.statusCode = 401;
      error.data=errors.array();
      next(error);    }
    directory.summaries.push(directoryId);
    const response = await directory.save();
    if(!response)
        throw new Error('The directory does not exists');
    res.status(200).json({
        directory:directory
    })
    
};



