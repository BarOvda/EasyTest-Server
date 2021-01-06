const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const User = require('../models/user');
const Summary = require('../models/summary');
const { use } = require('../routes/users');


exports.getAllSummaries = async (req, res, next) => {
  try{
    const summaries = await Summary.find();
    if(!summaries)
      throw new Error('Summaries does not found.')
    res.status(200).json({summaries:summaries});
  }catch(err){

  }
};
exports.uploadSummary = async (req, res, next) => {

  const pathUrl=req.file.path;
  const title = req.body.title;
  const owner = mongoose.Types.ObjectId(req.userId);
  const summary = new Summary({
    title: title,
    owner: owner,
    pathUrl: pathUrl
  });

  try{
    let user = await User.findById(owner);
    const result = await summary.save();
    user.uploadedSummaries.push(result);
    user = await user.save();
    res.status(201).json({summary: result,user:user});

  }catch(err){
     next(err);
    }

}
exports.getUserUploads = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  try{
    const owner = await User.findById(userId).populate('uploadedSummaries');
    const summaries = owner.uploadedSummaries;
    //console.log(owner);

    if(!summaries)
      throw new Error('summaries dosent exists.');
    res.status(200).json({summaries:summaries});
  }catch(err){
      return next(err);
  }
}

exports.getCourseSummaries = async (req, res, next) => {
  //const userId = req.userId;
  const courseId = req.params.courseId;


}
exports.rankUp = async (req, res, next) => {
  const userId = req.userId;
  const rank = req.body.rank;
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  try{
  const summary = await Summary.findById(summaryId);
    if(summary.rankedByUsers.includes(userId))
      throw new Error('The user alredy ranked this summary');
  const numberOfRanks = summary.rankedByUsers.length;
  summary.rank = ((summary.rank*numberOfRanks)+rank)/(numberOfRanks+1);
  summary.rankedByUsers.push(userId);
  summary = await summary.save();
  res.status(200).json({summary:summary});
  }catch(err){
    next(err);
  }

}


