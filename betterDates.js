const mongoose = require("mongoose");
const CatchRecord = require("./src/models/catchRecordModel");

const convertDateString = (dateStr) => {
	const [month, day, year] = dateStr.split("/");
	return `${year}/${month}/${day}`;
};

const updateDateFormats = async () => {
	mongoose.connect("mongodb://localhost:27017/bycatchDatabase", {
		useNewUrlParser: true,
		useUnifiedTopology: true,
	});

	const records = await CatchRecord.find({});
	for (const record of records) {
		const newDate = convertDateString(record.weekEndDate);
		record.weekEndDate = newDate;
		await record.save();
	}

	console.log("Date format update complete.");
};

updateDateFormats();
