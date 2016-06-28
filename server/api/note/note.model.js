'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose')),
    Schema = mongoose.Schema;

const NoteSchema = new Schema({
  title:     { type: String, default: '' },
  author:    { type: Schema.Types.ObjectId, required: true },
  content:   { type: String, default: '' },
  tags:      [String],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  active:    { type: Boolean, default: true },
  children:  [Schema.Types.ObjectId],
  parent:    Schema.Types.ObjectId,
  collapsed: { type: Boolean, default: true },
  seq:       { type: Number, default: 0 },
  fileId:    String
});

export default mongoose.model('Note', NoteSchema);
