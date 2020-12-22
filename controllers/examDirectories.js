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


exports.createDirectory = (req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseId);
    console.log("courseExists");
    
    CourseAppearance.exists({_id:courseId})
    .then(courseExists=>{
        console.log(courseExists);
        if(!courseExists){
            const error = new Error('Validation failed.');
            error.statusCode = 422;
            error.data=errors.array();
            throw error;
        }

        const ownerId = mongoose.Types.ObjectId(req.params.userId);    
          User.findById(ownerId).then(userExists=>{
            console.log(userExists);

            if(!userExists){
                const error = new Error('Validation failed.');
                error.statusCode = 422;
                error.data=errors.array();
                throw error;
            }
            const examDirectory = new ExamDirectory({
                owner:ownerId,
                courseId:courseId
            })
            examDirectory.save().then(directory=>{
                userExists.examsDirectories.push(directory);
                userExists.save().then(userRes=>{
                    res.status(201).json({
                        directory: directory
                      });
                    
                    })
            })
          })
        }).catch(err=>{
            if (!err.statusCode) {
                err.statusCode = 500;
              }
              next(err);
        })
};



exports.getDirectory = (req, res, next) => {
    const directoryId = mongoose.Types.ObjectId(req.params.directoryId);
    ExamDirectory.findById(directoryId)
    .then(directory=> {
      res
        .status(200)
        .json({directory: directory });
    })
    .catch(err => {
      if (!err.statusCode) {
        err.statusCode = 500;
      }
      next(err);
    });
};

exports.addFileToDirectory = async (req, res, next) => {
    const directoryId = mongoose.Types.ObjectId(req.params.directoryId);  
    
    
    const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
    const IsSummaryExists = await Summary.exists({_id:summaryId});
    if(!IsSummaryExists)
            throw new Error('The summary does not exists');
    const directory = await ExamDirectory.findById(directoryId);
    if(!directory)
        throw new Error('The directory does not exists');
    directory.summaries.push(directoryId);
    const response = await directory.save();
    if(!response)
        throw new Error('The directory does not exists');
    res.status(200).json({
        directory:directory
    })
    
};



