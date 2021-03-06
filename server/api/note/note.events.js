/**
 * Note model events
 */

'use strict';

import {EventEmitter} from 'events';
var Note = require('./note.model');
var NoteEvents = new EventEmitter();

// Set max event listeners (0 == unlimited)
NoteEvents.setMaxListeners(0);

// Model events
var events = {
  'save': 'save',
  'remove': 'remove'
};

// Register the event emitter to the model events
for (var e in events) {
  var event = events[e];
  Note.schema.post(e, emitEvent(event));
}

function emitEvent(event) {
  return function(doc) {
    NoteEvents.emit(event + ':' + doc._id, doc);
    NoteEvents.emit(event, doc);
  }
}

export default NoteEvents;
