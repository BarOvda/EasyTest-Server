const mongoose = require('mongoose');
const courseAppearance = require('./courseAppearance');

const Schema = mongoose.Schema;

const summarySchema = new Schema({
  title: {
    type: String,
    required: true
    
  },
  uploadDate: {
    type: String,
    default: Date.now
  },
  pathUrl: {
    type: String,
    required: false
  },
  owner:{
     type: Schema.Types.ObjectId, 
     ref: 'User' 
  },
  course:{
    type: Schema.Types.ObjectId, 
     ref: 'Course'
  }
  ,
  usersRank:[{
   user:{
    type: Schema.Types.ObjectId, 
    ref: 'Users',
    required:false
   } ,
    rank:{
      type: Number, 
     required:false
    }
  }],
  rank:{
    type: Number, 
     required:false,
     default:0
  }
});
summarySchema.index({ title: 'text'});
module.exports = mongoose.model('Summary', summarySchema);
