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
    required: true
  },
  owner:{
     type: Schema.Types.ObjectId, 
     ref: 'User' ,
     required:true
  },
  courseAppearance:{
    type: Schema.Types.ObjectId, 
     ref: 'CourseAppearance',
     required:true
  }
  ,
  usersRank:[{
   user:{
    type: Schema.Types.ObjectId, 
    ref: 'Users',
    required:true
   } ,
    rank:{
      type: Number, 
     required:true
    },
    default:[]
    
  }],
  rank:{
    type: Number, 
     required:true,
     default:0
  },
  isPrivate:{
    type:Boolean,
    required:true,
    default:false
  }
});
summarySchema.index({ title: 'text'});
module.exports = mongoose.model('Summary', summarySchema);