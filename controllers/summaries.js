const mongoose = require('mongoose');
const User = require('../models/user');
const Summary = require('../models/summary');
const feedConstants = require('../constants/feed.json');
const awsAPI = require('../helpers/awsAPI');
const ExamDirectory = require('../models/examDirectory');
const CourseAppearance = require('../models/courseAppearance');

exports.getAllSummaries = async (req, res, next) => {
  try {
    const summaries = await Summary.find();
    if (!summaries)
      throw new Error('Summaries does not found.')
    res.status(200).json({ summaries: summaries });
  } catch (err) {
    next(err);
  }
};
exports.uploadSummary = async (req, res, next) => {
  console.log(req.file);
  const title = req.file.originalname;
  let fileNameUpload = req.file.filename;
  let only_name = fileNameUpload.split(".")[0];
  // Enter the file you want to upload here
  const folder = 'files';
  awsAPI.uploadFile(req.file, folder);
  const pathUrl = `https://easy-test-s3.s3.amazonaws.com/${folder}/${only_name}`;
  console.log(req.file);
  const owner = mongoose.Types.ObjectId(req.userId);
  const courseAppId = req.params.courseAppId;
  const isPrivate = req.body.isPrivate;
  const summary = new Summary({
    title: title,
    owner: owner,
    pathUrl: pathUrl,
    courseAppearance: courseAppId,
    isPrivate: isPrivate
  });

  try {
    let user = await User.findById(owner);
    const result = await summary.save();
    user.uploadedSummaries.push(result);
    user = await user.save();
    res.status(201).json({ summary: result, user: user });

  } catch (err) {
    next(err);
  }

}
exports.getUserUploads = async (req, res, next) => {
  const userId = req.userId;
  console.log(userId);
  try {
    const owner = await User.findById(userId).populate('uploadedSummaries');
    const summaries = owner.uploadedSummaries;
    //console.log(owner);

    if (!summaries)
      throw new Error('summaries dosent exists.');
    res.status(200).json({ summaries: summaries });
  } catch (err) {
    return next(err);
  }
};

exports.rankUp = async (req, res, next) => {
  const userId = req.userId;
  const rank = req.body.rank;
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  let exists = 0;
  try {
    let summary = await Summary.findById(summaryId);
    const numberOfRanks = summary.usersRank.length;

    summary.usersRank.forEach(element => {
      if (element.user.toString() === userId) {
        summary.rank = ((summary.rank * numberOfRanks) - element.usersRank + rank) / (numberOfRanks);

        element.usersRank = rank;
        exists = 1;
      }
    })
    if (exists == 0) {
      console.log("id");

      summary.usersRank.push({ user: userId, rank: rank });
      summary.rank = ((summary.rank * (numberOfRanks)) + rank) / (numberOfRanks + 1);
      summary = await summary.save();
    } else {
      console.log("UPDATE");
      summary = null
      // summary = await summary.updateOne({ "usersRank.user": userId }, summary);
    }
    res.status(200).json({ summary: summary });
  } catch (err) {
    next(err);
  }

};
exports.getUsersRank = async (req, res, next) => {
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  const perPage = feedConstants.NUM_OF_RANKS_OF_SUMMARY_PER_PAGE;
  const currentPage = req.query.page || 0;
  try {
    const summary = await Summary.findById(summaryId)
      .lean()
      .populate({
        path: usersRank,
        options: {
          limit: perPage,
          //sort: { 'usersRank.rank': -1},
          skip: currentPage * perPage
        }
      })
      .exec(function (err, result) {
        if (!result.usersRank.user)
          delete result;
      });
    if (!summary)
      throw new Error('The file does not exists.');
    res.status(200).json({ ranks: summary.usersRank });
  } catch (err) {
    next(err);
  }
}

exports.getSummaryDetailes = async (req, res, next) => {
  try {

   
    const summaryId = mongoose.Types.ObjectId(req.params.id);
    const summary = await Summary.findById(summaryId).populate('usersRank').populate( {
      path: 'courseAppearance',
      populate: {
        path: 'couresId',
        }
      });//TODO Check it
    res.status(200).json({ summary: summary });

  } catch (err) {
    next(err);
  }

}


exports.searchByKeyWord = async (req, res, next) => {
  const keyWord = req.body.keyWord;
  let courseId = req.body.courseId;
  let appearnces;
  try {
    let searchResult;
    if (courseId === undefined) {

      searchResult = await Summary.find({ $text: { $search: keyWord }, isPrivate: false });
    } else if (keyWord === undefined) {
      courseId = mongoose.Types.ObjectId(courseId);
      console.log(courseId);
      // console.log("courseSearcj");      

      appearnces = await CourseAppearance.find({ couresId: courseId });

      appearnces = appearnces.map(app => app._id);

      searchResult = await Summary.find({
        courseAppearance: {
          $in: [appearnces]
        }, isPrivate: false
      });

    } else {
      courseId = mongoose.Types.ObjectId(courseId);
      appearnces = await CourseAppearance.find({ couresId: courseId });

      appearnces = appearnces.map(app => app._id);

      searchResult = await Summary.find({
        $text: { $search: keyWord }, courseAppearance: {
          $in: [appearnces]
        }, isPrivate: false
      });

    }
    console.log(searchResult);
    if (!searchResult)
      throw new Error("there is no results");
    res.status(200).json({ results: searchResult });
  } catch (err) {
    next(err);
  }
};
exports.uploadSummaryToDirectory = async (req, res, next) => {

  const title = req.file.originalname;
  let fileNameUpload = req.file.filename;
  let only_name = fileNameUpload.split(".")[0]
  // Enter the file you want to upload here
  const folder = 'files';
  awsAPI.uploadFile(req.file, folder);
  const pathUrl = `https://easy-test-s3.s3.amazonaws.com/${folder}/${only_name}`;
  console.log(req.file);
  const owner = req.userId;
  const directoryId = req.params.directoryId;
  try {
    let directory = await ExamDirectory.findById(directoryId);
    const courseAppId = directory.courseId;
    const isPrivate = req.body.isPrivate;
    const summary = new Summary({
      title: title,
      owner: owner,
      pathUrl: pathUrl,
      courseAppearance: courseAppId,
      isPrivate: isPrivate
    });
    let user = await User.findById(owner);
    const result = await summary.save();
    directory.summaries.push(result._id);
    //console.log(directory.summaries);

    directory = await directory.save();

    user.uploadedSummaries.push(result);

    user = await user.save();

    res.status(201).json({ directory: directory });

  } catch (err) {
    next(err);
  }
}
exports.deleteSummaryFromDirectory = async (req, res, next) => {
  const userId = req.userId;
  const summaryId = mongoose.Types.ObjectId(req.params.summaryId);
  const directoryId = mongoose.Types.ObjectId(req.params.directoryId);

  try {
    let directory = await ExamDirectory.findById(directoryId);
    if (!directory)
      throw new Error('Directory does not found.')
    const summaries = directory.summaries;
    if (!summaries)
      throw new Error('Empty Directory.')
    const summary = summaries.find(file => file._id === summaryId);
    if (!summary)
      throw new Error('Summary not Found in the Directory.')
    directory.summaries.pull({ _id: summaryId }) // removed
    const folder = 'files';
    console.log(summary.isPrivate);
    if (summary.isPrivate == true) {
      awsAPI.deleteFile(summary.title, folder);
      console.log("to delete");
    }
    const result = await directory.save();
    res.status(201).json({ result: result });
  } catch (err) {
    next(err);

  }

}
