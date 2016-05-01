'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose')),
    Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title: String,
  author: Schema.Types.ObjectId,
  content: String,
  tags: [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  active: { type: Boolean, default: true }
});

export default mongoose.model('Note', NoteSchema);
