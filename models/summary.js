const mongoose = require('mongoose');

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
  }
  
});

module.exports = mongoose.model('Summary', summarySchema);
