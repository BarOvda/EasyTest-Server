const User = require('../models/user');
const Summary = require('../models/summary');
const feedConstants = require('../constants/feed.json');
exports.getFeed = async (req, res, next) => {
    const userId = req.userId;
    const currentPage = req.query.page || 0;
    const perPage = feedConstants.NUM_OF_SUMMARIES_PER_PAGE;
    try{
        const user = await (await User.findById(userId)).populated("followedCourses");
        const courses = user.followedCourses;
        let feed = [];
        courses.forEach(async course=>{
            const summaries = await Summary.find({course:course._id})
            .sort('-rank')
            .skip(currentPage * perPage)
            .limit(perPage);
            feed.push(...summaries);
        });
        res.status(200).json({feed:feed});
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




