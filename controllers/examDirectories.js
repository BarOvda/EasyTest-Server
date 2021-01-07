
const mongoose = require('mongoose');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const CourseAppearance = require('../models/courseAppearance');
const Summary = require('../models/summary');


exports.createDirectory = async(req, res, next) => {
    const courseId = mongoose.Types.ObjectId(req.params.courseId);
    const ownerId = req.userId;    
    try{
      const courseExists = await CourseAppearance.exists({_id:courseId});
      const userExists = await User.findById(ownerId);
      
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
    }catch(error){
      next(error);
    }
};



exports.getDirectory = async (req, res, next) => {
    const directoryId = mongoose.Types.ObjectId(req.params.directoryId);
    
    try{
    const directory = await ExamDirectory.findById(directoryId);
    console.log(directory.owner);
    console.log(req.userId);
    if(directory.owner!=req.userId)
      throw new Error('Autantication failiaure');
    res.status(200).json({directory: directory });
    }catch(err){
      return next(err);
    }
      
};

exports.addFileToDirectory = async (req, res, next) => {
    const directoryId = mongoose.Types.ObjectId(req.params.directoryId);  
    const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
   try{
    const IsSummaryExists = await Summary.exists({_id:summaryId});
    const directory = await ExamDirectory.findById(directoryId);
    if(!IsSummaryExists)
      throw new Error('The file does not exists.'); 
    if(!directory)
      throw new Error('The directory does not exists.');
    if(directory.owner!=req.userId)
      throw new Error('Autantication failiaure');
    console.log(directory.summaries.indexOf(req.params.summaryId));
     if(directory.summaries.indexOf(req.params.summaryId)!==-1)
       throw new Error('The summarie alredy in this directory');
    
      directory.summaries.push(summaryId);

    const response = await directory.save();
    if(!response)
      throw new Error('The directory does not updated.').statusCode(401).data(errors.array()); 

    res.status(200).json({directory:response});
   }catch(error){
      next(error);
   }
};



