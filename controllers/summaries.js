const mongoose = require('mongoose');
const User = require('../models/user');
const Summary = require('../models/summary');
const feedConstants = require('../constants/feed.json');
const awsAPI = require('../helpers/awsAPI');

exports.getAllSummaries = async (req, res, next) => {
  try{
    const summaries = await Summary.find();
    if(!summaries)
      throw new Error('Summaries does not found.')
    res.status(200).json({summaries:summaries});
  }catch(err){
    next(err);
  }
};
exports.uploadSummary = async (req, res, next) => {

  const title = req.file.originalname;
  const fileNameUpload = req.file.filename;
  // Enter the file you want to upload here
  const folder = 'files';
   awsAPI.uploadFile(req.file,folder);
   const pathUrl = `https://easy-test-s3.s3.amazonaws.com/${folder}/${fileNameUpload}`;
  console.log(req.file);
  const owner = mongoose.Types.ObjectId(req.userId);
  const courseAppId = req.params.courseAppId;
  const summary = new Summary({
    title: title,
    owner: owner,
    pathUrl: pathUrl,
    courseAppearance:courseAppId
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
};

exports.rankUp = async (req, res, next) => {
  const userId = req.userId;
  const rank = req.body.rank;
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  try{
  let summary = await Summary.findById(summaryId);
  console.log(userId);
  
  if(summary.usersRank.some(s=>s.user.toString()===userId))
      throw new Error('The user alredy ranked this summary');
  const numberOfRanks = summary.usersRank.length;
  summary.rank = ((summary.rank*numberOfRanks)+rank)/(numberOfRanks+1);
  summary.usersRank.push({user:userId,rank:rank});
  summary = await summary.save();
  res.status(200).json({summary:summary});
  }catch(err){
    next(err);
  }

};
exports.getUsersRank = async (req, res, next) => {
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  const perPage = feedConstants.NUM_OF_RANKS_OF_SUMMARY_PER_PAGE;
  const currentPage = req.query.page || 0;
  try{
    const summary =  await Summary.findById(summaryId)
    .lean()
    .populate({
      path:usersRank,
      options: {
        limit: perPage,
        //sort: { 'usersRank.rank': -1},
        skip: currentPage*perPage}
    })
    .exec(function (err, result){ 
      if (!result.usersRank.user) 
          delete result;
    });
    if(!summary)
        throw new Error('The file does not exists.');
    res.status(200).json({ranks:summary.usersRank});
    }catch(err){
      next(err);
    }
}
