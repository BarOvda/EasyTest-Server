const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const Course = require('../models/course');

exports.uploadCourse = (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data=errors.array();
      throw error;
    }
    const name = req.body.name;
    const course = new Course({
        name: name
      });
    return course.save().catch(err=>{
        if (!err.statusCode) 
            err.statusCode = 500;
        next(err);
    }).then(result=>{
        res.status(201).json({
        user: result  })
    })
};
    
        
        
          
        
    
    

    




