const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const taskSchema = new Schema({
  section: {
    type: Schema.Types.ObjectId,
    ref: 'Section',
    required: true
  },
  title: {
    type: String,
    default: ''
  },
  content: {
    type: String,
    default: ''
  },
  position: {
    type: Number
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high'],
    default: 'medium'
  },
  tags: [{
    type: String
  }],
  dueDate: {
    type: Date
  },
  status: {
    type: String,
    enum: ['todo', 'in-progress', 'completed'],
    default: 'todo'
  }
}, schemaOptions)

module.exports = mongoose.model('Task', taskSchema)