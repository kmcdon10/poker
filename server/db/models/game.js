'use strict';
var mongoose = require('mongoose');
var ObjectId = mongoose.Schema.Types.ObjectId;

var schema = new mongoose.Schema({
  name: {
		type: String,
		required: true,
  },
  deck: {
		type: ObjectId,
		ref: 'Card'
  },
});

mongoose.model('Game', schema);
