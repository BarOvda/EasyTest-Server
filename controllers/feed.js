const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const CourseAppearance = require('../models/courseAppearance'); 
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');
const Summary = require('../models/summary');

exports.getFeed = async (req, res, next) => {
    const userId = req.userId;
    //TODO get user.courses -> get summaries attached to course with best rank
}
exports.searchSummaryByKeyWord = async (req, res, next) => {
    //const userId = req.userId;
    const keyWord = req.body.keyWord;
    try{
        const searchResult = await Summary.find({
            $text:{$search:keyWord}
        });
        if(!searchResult)
            throw new Error("there is no results");
        res.status(200).json({results:searchResult});
    }catch(err){    
        next(err);
    }

}
