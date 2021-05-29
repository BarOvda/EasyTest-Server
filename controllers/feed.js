const User = require('../models/user');
const Summary = require('../models/summary');
const feedConstants = require('../constants/feed.json');
const courseAppearance = require('../models/courseAppearance');
const FeedUtils = require('../utils/feed');
const mongoose = require('mongoose');




exports.getFeed = async (req, res, next) => {
    const userId = req.userId;

    try {

        const user = await User.findById(userId).populate("followedCourses");
        const courses = user.followedCourses;
        if (!courses) {
            res.status(200).json({ data: [] });
        }
        let appearancesIds = [];
        courses.forEach(course => {
            if (course != null && course.appearances != null) {
                course.appearances.forEach(app => {
                    if (app != null && mongoose.Types.ObjectId.isValid(app._id)) {
                        let convertedId = mongoose.Types.ObjectId(app._id);
                        appearancesIds.push(convertedId);
                    }
                });
            }
        });

        var i;
        let feed = [];
        var total_rankers = 0;
        var avg_sum = 0;
        for (i = 0; i < appearancesIds.length; i++) {
            let sums = await Summary.find({ courseAppearance: appearancesIds[i], isPrivate: false })
                .populate("owner").populate("courseAppearance");
            feed.push.apply(feed, sums);

            sums.forEach(sum => {
                // console.log("new summary------------")
                // console.log(sum)
                if (sum.usersRank != null) {
                    total_rankers += sum.usersRank.length;
                    console.log(sum.usersRank.length)

                }
                if (sum.rank != null) {
                    avg_sum += sum.rank;
                    console.log(sum.rank)
                }
            })

        }
        console.log("avg_sum " + avg_sum)
        console.log("total_rankers " + total_rankers)
        // console.log(feed)
        avg_sum = avg_sum / feed.length;
        feed.sort(function (a, b) {
            let bayesian_score_a = FeedUtils.bayesianScore(a, avg_sum, total_rankers);
            let bayesian_score_b = FeedUtils.bayesianScore(b, avg_sum, total_rankers);
            return bayesian_score_b-bayesian_score_a;

        })
        res.status(200).json({ data: feed });
    } catch (err) {
        next(err);
    }
}

exports.searchSummaryByKeyWord = async (req, res, next) => {
    const keyWord = req.body.keyWord;
    try {
        const searchResult = await Summary.find({ $text: { $search: keyWord } });
        if (!searchResult)
            throw new Error("there is no results");
        res.status(200).json({ results: searchResult });
    } catch (err) {
        next(err);
    }
};
exports.searchSummaryByCourse = async (req, res, next) => {
    const courseId = req.params.courseId;

    try {
        const searchResult = await Summary.find({ course: courseId });
        if (!searchResult)
            throw new Error("there is no results");
        res.status(200).json({ results: searchResult });
    } catch (err) {
        next(err);
    }

};
exports.searchSummaryByCourseAndKeyWord = async (req, res, next) => {
    const courseId = req.params.courseId;
    const keyWord = req.body.keyWord;
    try {
        const searchResult = await Summary.find({
            course: courseId
            , $text: { $search: keyWord }
        });
        if (!searchResult)
            throw new Error("there is no results");
        res.status(200).json({ results: searchResult });
    } catch (err) {
        next(err);
    }
}




// exports.getFeed = async (req, res, next) => {
//     const userId = req.userId;
//     const currentPage = req.query.page || 0;
//     const perPage = feedConstants.NUM_OF_SUMMARIES_PER_PAGE;
//     try {
//         const user = await User.findById(userId).populate("followedCourses");
//         const courses = user.followedCourses;
//         if (!courses) {
//             res.status(200).json({ data: [] });
//         }
//         let appearancesIds = [];
//         courses.forEach(course => {
//             if (course != null) {
//                 course.appearances.forEach(app => {
//                     if (app != null && mongoose.Types.ObjectId.isValid(app._id)) {
//                         let convertedId = mongoose.Types.ObjectId(app._id);
//                         appearancesIds.push(convertedId);
//                     }
//                 });
//             }
//         });

//         var i;
//         let feed = [];
//         for (i = 0; i < appearancesIds.length; i++) {
//             let sum = await Summary.find({ courseAppearance: appearancesIds[i], isPrivate: false })
//                 .populate("owner").populate("courseAppearance");
//             feed.push.apply(feed, sum);
//         }
//         res.status(200).json({ data: feed });
//     } catch (err) {
//         next(err);
//     }
// }