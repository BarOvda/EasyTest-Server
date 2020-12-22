const mongoose = require('mongoose');

const Schema = mongoose.Schema;

const courseAppearanceSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  couresId:{
    type: Schema.Types.ObjectId, 
    ref: 'Course' 
 },
 examsDateA:{
    type: Date,
    required: true
 },
 examsDateB:{
    type: Date,
    required: true
 },
 students:[{
    type: Schema.Types.ObjectId, 
    ref: 'User' 
}]
});

module.exports = mongoose.model('CourseAppearance', courseAppearanceSchema);
