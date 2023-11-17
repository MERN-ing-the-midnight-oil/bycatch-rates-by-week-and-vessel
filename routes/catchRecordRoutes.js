const express = require("express");
const router = express.Router();
const CatchRecord = require("../src/models/catchRecordModel"); // Update the path as necessary

console.log(
	"the CatchRecord imported from catchRecordModel.js to catchRecordRoutes.js is: ",
	CatchRecord
);

router.get("/catchrecords", async (req, res) => {
	try {
		// Fetch the first complete catch record
		const record = await CatchRecord.findOne({});
		if (!record) {
			return res.status(404).send("No catch records found");
		}
		res.json([record]); // Send the record within an array
	} catch (error) {
		console.error("Error in catchrecords route:", error);
		res.status(500).send("Internal Server Error");
	}
});

module.exports = router;
