const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  appearances:[{
    type: Schema.Types.ObjectId, 
    ref: 'CourseAppearance' 
 }]
});

module.exports = mongoose.model('Course', courseSchema);
