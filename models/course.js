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
 }],
 followers:[{
  type: Schema.Types.ObjectId, 
  ref: 'Users' 
 }]
});
courseSchema.index({ name: 'text'});

module.exports = mongoose.model('Course', courseSchema);
