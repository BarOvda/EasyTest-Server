const User = require('../models/user');
const Summary = require('../models/summary');
const feedConstants = require('../constants/feed.json');
const courseAppearance = require('../models/courseAppearance');
const mongoose = require('mongoose');

exports.getFeed = async (req, res, next) => {
    const userId = req.userId;
    console.log(userId);
    const currentPage = req.query.page || 0;
    const perPage = feedConstants.NUM_OF_SUMMARIES_PER_PAGE;
    try{
        const user =  await User.findById(userId).populate("followedCourses");
        const courses = user.followedCourses;
        if(!courses){
            res.status(200).json({data:[]});
        }
        let appearancesIds = [];
        courses.forEach(course=>{
            course.appearances.forEach(app=>{
                if(mongoose.Types.ObjectId.isValid(app._id))
                {let convertedId =  mongoose.Types.ObjectId(app._id);
                appearancesIds.push(convertedId) ;   }
            });
        });

         console.log(appearancesIds);
       var i;
       let feed=[];
        for (i = 0; i < appearancesIds.length; i++) {
        let sum = await Summary.find({courseAppearance:appearancesIds});
        feed.push.apply(feed,sum);   
        }
        console.log(feed);
        res.status(200).json({data:feed});
    }catch(err){
        next(err);
    } 
}
exports.searchSummaryByKeyWord = async (req, res, next) => {
    const keyWord = req.body.keyWord;
    try{
        const searchResult = await Summary.find({$text:{$search:keyWord}});
        if(!searchResult)
            throw new Error("there is no results");
        res.status(200).json({results:searchResult});
    }catch(err){    
        next(err);
    }
};
exports.searchSummaryByCourse = async (req, res, next) => {
    const courseId = req.params.courseId;

    try{
        const searchResult = await Summary.find({course:courseId});
        if(!searchResult)
            throw new Error("there is no results");
        res.status(200).json({results:searchResult});
    }catch(err){    
        next(err);
    }

};
exports.searchSummaryByCourseAndKeyWord = async (req, res, next) => {
    const courseId = req.params.courseId;
    const keyWord = req.body.keyWord;
    try{
        const searchResult = await Summary.find({course:courseId
        ,$text:{$search:keyWord}});
        if(!searchResult)
            throw new Error("there is no results");
        res.status(200).json({results:searchResult});
    }catch(err){    
        next(err);
    }
}




