const mongoose = require("mongoose");

const VesselSchema = new mongoose.Schema({
	vesselID: {
		type: String,
		required: true,
		unique: true,
		maxlength: 4, // Based on your description that VESSEL ID has a width of 4
	},
	name: {
		type: String,
		required: true,
		maxlength: 20, // Assuming NAME has a width of 20
	},
});

const Vessel = mongoose.model("Vessel", VesselSchema);

module.exports = Vessel;
