const mongoose = require("mongoose");

const CatchRecordSchema = new mongoose.Schema({
	weekEndDate: {
		type: Date,
		required: true,
	},
	vessel: {
		type: mongoose.Schema.Types.ObjectId,
		ref: "Vessel",
		required: true,
	},
	area: {
		type: String,
		required: false,
	},
	gear: {
		type: String,
		required: false,
	},
	target: {
		type: String,
		required: false,
	},
	halibut: {
		type: Number,
		required: false,
	},
	herring: {
		type: Number,
		required: false,
	},
	redKingCrab: {
		type: Number,
		required: false,
	},
	otherKingCrab: {
		type: Number,
		required: false,
	},
	bairdiTanner: {
		type: Number,
		required: false,
	},
	otherTanner: {
		type: Number,
		required: false,
	},
	chinook: {
		type: Number,
		required: false,
	},
	nonChinook: {
		type: Number,
		required: false,
	},
	sampledHauls: {
		type: Number,
		required: false,
	},
});

const CatchRecord = mongoose.model("CatchRecord", CatchRecordSchema);

//mongoose will look for or create a collection with pluralized, lowercase form of CatchRecord, so catchrecords
module.exports = CatchRecord;
