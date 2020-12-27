const fs = require('fs');
const path = require('path');
const bcrypt = require('bcryptjs');
const webToken = require('jsonwebtoken');
const { validationResult } = require('express-validator');
const mongoose = require('mongoose');

const User = require('../models/user');
const Summary = require('../models/summary');

exports.uploadSummary = async (req, res, next) => {


    
  const pathUrl=req.file.path;
  const title = req.body.title;
  const owner = mongoose.Types.ObjectId(req.params.userId);

  const summary = new Summary({
    title: title,
    owner: owner,
    pathUrl: pathUrl
  });

  try{
    const result = await summary.save();
    res.status(201).json({summary: result});

  }catch(err){
     next(err);
    }

}