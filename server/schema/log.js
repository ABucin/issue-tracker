var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var LogSchema = new Schema({
	key: {
		type: String,
		required: true,
		unique: true
	},
	action: {
		type: String,
		required: true
	},
	target: {
		type: String,
		required: true
	},
	targetType: {
		type: String,
		required: true
	},
	comment: {
		type: String
	},
	amount: {
		type: Number,
		default: 0
	},
	username: {
		type: String,
		required: true
	},
	timestamp: {
		type: Date,
		default: Date.now
	}
});

var Log = mongoose.model("Log", LogSchema);

exports.getLog = function () {
	return Log;
};

exports.getLogSchema = function () {
	return LogSchema;
};