const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');

const CourseAppearance = require('../models/courseAppearance'); 
const User = require('../models/user');
const ExamDirectory = require('../models/examDirectory');


exports.getFeed = async (req, res, next) => {

}