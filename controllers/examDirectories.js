const mongoose = require('mongoose');
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const CourseAppearance = require('../models/courseAppearance');
const Summary = require('../models/summary');
const awsAPI = require('../helpers/awsAPI');


exports.createDirectory = async (req, res, next) => {
  console.log("false")

  const courseId = mongoose.Types.ObjectId(req.body.courseId);
  const ownerId = mongoose.Types.ObjectId(req.body.userId);
  console.log(ownerId)
  console.log(courseId)
  try {
    if (req.createDirectory != true) {
      console.log("false")
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      next(error);
    }
    const courseExists = await CourseAppearance.exists({ _id: courseId });
    const userExists = await User.findById(ownerId);

    if (!userExists || !courseExists) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data = errors.array();
      next(error);
    }
    const examDirectory = new ExamDirectory({
      owner: ownerId,
      courseId: courseId
    })
    const directory = await examDirectory.save();
    userExists.examsDirectories.push(directory);
    console.log("in here");
    const userRes = await userExists.save();
    console.log("in here");

    res.status(201).json({ directory: directory, user: userRes });
  } catch (error) {
    next(error);
  }
};



exports.getDirectory = async (req, res, next) => {
  const directoryId = mongoose.Types.ObjectId(req.params.directoryId);

  try {
    const directory = await ExamDirectory.findById(directoryId).populate("summaries").populate("courseId");
    console.log(directory);
    console.log(req.userId);
    if (directory.owner != req.userId)
      throw new Error('Autantication failiaure');
    res.status(200).json({ directory: directory });
  } catch (err) {
    return next(err);
  }

};

exports.addFileToDirectory = async (req, res, next) => {
  const directoryId = mongoose.Types.ObjectId(req.params.directoryId);
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  try {
    const IsSummaryExists = await Summary.exists({ _id: summaryId });
    const directory = await ExamDirectory.findById(directoryId);
    if (!IsSummaryExists)
      throw new Error('The file does not exists.');
    if (!directory)
      throw new Error('The directory does not exists.');
    if (directory.owner != req.userId)
      throw new Error('Autantication failiaure');
    console.log(directory.summaries.indexOf(req.params.summaryId));
    if (directory.summaries.indexOf(req.params.summaryId) !== -1)
      throw new Error('The summarie alredy in this directory');

    directory.summaries.push(summaryId);

    const response = await directory.save();
    if (!response)
      throw new Error('The directory does not updated.').statusCode(401).data(errors.array());

    res.status(200).json({ directory: response });
  } catch (error) {
    next(error);
  }
};


exports.removeFileFromDirectory = async (req, res, next) => {
  //console.log(req.params.directoryId);
  const directoryId = mongoose.Types.ObjectId(req.params.directoryId);
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  try {
    const IsSummaryExists = await Summary.exists({ _id: summaryId });
    const directory = await ExamDirectory.findById(directoryId).populate('summaries');
    console.log(directory);
    if (!IsSummaryExists)
      throw new Error('The file does not exists.');
    if (!directory)
      throw new Error('The directory does not exists.');
    if (directory.owner != req.userId)
      throw new Error('Autantication failiaure');

    // const summary = directory.summaries.find(file => file._id === summaryId);
    const folder = 'files';
    // const index = directory.summaries.indexOf(summaryId);
    let summary;
    directory.summaries.forEach(element => {
      console.log(element._id)
      console.log(summaryId)
      if (element._id.equals(summaryId))
        summary = element;
    });

    // console.log(summary);

    directory.summaries.pull({ _id: summaryId });
    // const summary = directory.summaries[index];

    let awsFileKey = summary.pathUrl.split('/');
    awsFileKey = awsFileKey[awsFileKey.length - 1];
    console.log(awsFileKey);
    if (summary.isPrivate == true) {
      awsAPI.deleteFile(awsFileKey, folder);
    }
    // summaries
    const response = await directory.save();

    if (!response)
      throw new Error('The directory does not updated.').statusCode(401).data(errors.array());

    res.status(200).json({ directory: response });
  } catch (error) {
    next(error);
  }
};





