'use strict';
var mongoose = require('mongoose');

var schema = new mongoose.Schema({
  suit: {
		type: String,
		required: true,
  },
  value: [{
		type: String,
		required: true,
  }],
});

mongoose.model('Card', schema);
