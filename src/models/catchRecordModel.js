const mongoose = require("mongoose");

const CatchRecordSchema = new mongoose.Schema({
	weekEndDate: {
		type: String,
		required: true,
	},
	vessel: {
		//declares that the field will store a MongoDB ObjectId
		type: mongoose.Schema.Types.ObjectId,
		//tells Mongoose that the ObjectId refers to the "Vessel" model
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
let CatchRecord;

try {
	CatchRecord = mongoose.model("CatchRecord");
} catch (error) {
	//if the model does not exist, compile it
	CatchRecord = mongoose.model("CatchRecord", CatchRecordSchema);
}
//mongoose will look for or create a collection with pluralized, lowercase form of CatchRecord, so catchrecords
module.exports = CatchRecord;
