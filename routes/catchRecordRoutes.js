const express = require("express");
const router = express.Router();
const CatchRecord = require("../src/models/catchRecordModel"); // Update the path as necessary

console.log(
	"the CatchRecord imported from catchRecordModel.js to catchRecordRoutes.js is: ",
	CatchRecord
);

router.get("/catchrecords", async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 10; // Default to 10 records if limit is not specified
		const skip = parseInt(req.query.skip) || 0; // Default to start from the beginning if skip is not specified

		// Fetch the catch records with limit and skip
		const records = await CatchRecord.find({}).limit(limit).skip(skip);
		if (!records || records.length === 0) {
			return res.status(404).send("No catch records found");
		}
		res.json(records);
	} catch (error) {
		console.error("Error in catchrecords route:", error);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
