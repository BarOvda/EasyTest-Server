
const { validationResult } = require('express-validator');

const Course = require('../models/course');

exports.uploadCourse =async (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      const error = new Error('Validation failed.');
      error.statusCode = 422;
      error.data=errors.array();
      next(error);
    }
    const name = req.body.name;
    const course = new Course({
        name: name
      });
      try{

      
    const result = await course.save();
    res.status(201).json({course: result });
      }catch(err){
        return next(err);
      }
};
    
        
        
          
        
    
    

    




