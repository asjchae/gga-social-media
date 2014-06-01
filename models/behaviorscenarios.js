var mongoose = require('mongoose');

var quiz_schema = mongoose.Schema({
	behaviors: Array,
	stories: Array,
	results: Array
});

var quiz = mongoose.model('quiz', quiz_schema);

module.exports = quiz;