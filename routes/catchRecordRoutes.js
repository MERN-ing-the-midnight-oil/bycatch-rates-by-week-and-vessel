//This file contains my Express routes (router.get endpoints) that handle HTTP GET requests. Each route is designed to respond to a specific URL path and HTTP method.

const express = require("express");
const router = express.Router();
const CatchRecord = require("../src/models/catchRecordModel"); // Update the path as necessary

console.log(
	"the CatchRecord imported from catchRecordModel.js to catchRecordRoutes.js is: ",
	CatchRecord
);
// Get records by date range
router.get("/catchrecords/daterange", async (req, res) => {
	try {
		const { startDate, endDate, page = 0, pageSize = 10 } = req.query;
		if (!startDate || !endDate) {
			return res.status(400).send("Start date and end date are required");
		}

		// Convert startDate and endDate to Date objects
		const start = new Date(startDate);
		const end = new Date(endDate);

		// Ensure valid date objects
		if (isNaN(start.getTime()) || isNaN(end.getTime())) {
			return res.status(400).send("Invalid start date or end date");
		}

		// Calculate the number of records to skip based on the current page
		const skipCount = Number(page) * Number(pageSize);

		const records = await CatchRecord.find({
			weekEndDate: { $gte: start, $lte: end },
		})
			.limit(Number(pageSize)) // Defines the number of records per page
			.skip(skipCount) // Calculates the number of records to skip based on the current page
			.populate("vessel", "name"); // Populate the 'vessel' field

		if (!records || records.length === 0) {
			return res
				.status(404)
				.send("No catch records found for the given date range");
		}
		res.json(records);
	} catch (error) {
		console.error("Error in /catchrecords/daterange route:", error);
		res.status(500).send("Internal Server Error");
	}
});

//get records by year
router.get("/catchrecords/year", async (req, res) => {
	try {
		const { year, page = 0, pageSize = 10 } = req.query;
		if (!year) {
			return res.status(400).send("Year is required");
		}

		// Convert year to a Date range
		const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
		const endDate = new Date(`${year}-12-31T23:59:59.999Z`);

		// Calculate the number of records to skip based on the current page
		const skipCount = Number(page) * Number(pageSize);

		const records = await CatchRecord.find({
			weekEndDate: { $gte: startDate, $lte: endDate },
		})
			.limit(Number(pageSize)) // Defines the number of records per page
			.skip(skipCount) // Calculates the number of records to skip based on the current page
			.populate("vessel", "name"); // Populate the 'vessel' field

		if (!records || records.length === 0) {
			return res.status(404).send("No catch records found for the given year");
		}
		res.json(records);
	} catch (error) {
		console.error("Error in catchrecords/year route:", error);
		res.status(500).send("Internal Server Error");
	}
});

//Grabbing the first 10 records in the mongo DB
router.get("/catchrecords", async (req, res) => {
	try {
		const limit = parseInt(req.query.limit) || 10; // Default to 10 records if limit is not specified
		const skip = parseInt(req.query.skip) || 0; // Default to start from the beginning if skip is not specified

		// Fetch the catch records with limit and skip, and populate the vessel field
		const records = await CatchRecord.find({})
			.limit(limit)
			.skip(skip)
			.populate("vessel", "name"); // Assuming 'name' is the field you want from the Vessel document

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
