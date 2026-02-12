const mongoose = require('mongoose')
const Schema = mongoose.Schema
const { schemaOptions } = require('./modelOptions')

const sectionSchema = new Schema({
  board: {
    type: Schema.Types.ObjectId,
    ref: 'Board',
    required: true
  },
  title: {
    type: String,
    default: ''
  }
}, schemaOptions)

sectionSchema.index({ board: 1 })

module.exports = mongoose.model('Section', sectionSchema)