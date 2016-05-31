'use strict';

const mongoose = require('bluebird').promisifyAll(require('mongoose')),
  Schema = mongoose.Schema;

import Note from '../note/note.model';

var SectionSchema = new Schema({
  user: Schema.Types.ObjectId,
  note: Note.schema
});

SectionSchema.add({
  children: [SectionSchema]
});

export default mongoose.model('Section', SectionSchema);
