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
  },
  subtasks: [{
    id: {
      type: String,
      required: true
    },
    title: {
      type: String,
      default: ''
    },
    completed: {
      type: Boolean,
      default: false
    }
  }]
}, schemaOptions)

taskSchema.index({ section: 1, position: 1 })
taskSchema.index({ status: 1 })
taskSchema.index({ priority: 1 })
taskSchema.index({ dueDate: 1 })

module.exports = mongoose.model('Task', taskSchema)