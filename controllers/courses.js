const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
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
    const result = await course.save();
    res.status(201).json({user: result });
};
    
        
        
          
        
    
    

    




