//This file contains my Express routes (router.get endpoints) that handle HTTP GET requests. Each route is designed to respond to a specific URL path and HTTP method.

const express = require("express");
const router = express.Router();
const CatchRecord = require("../src/models/catchRecordModel");

router.get("/catchrecords/year", async (req, res) => {
	try {
		const { year, page = 0, pageSize = 10 } = req.query;
		console.log("/catchrecords/year route is being used"); // Log route usage
		console.log("Year being queried:", year); // Log the year being queried

		if (!year) {
			return res.status(400).send("Year is required");
		}

		const yearShort = year.slice(-2); // Extract last two digits of the year
		const regex = new RegExp(`^${yearShort}`); // Create a regex to match dates starting with the year

		const skipCount = Number(page) * Number(pageSize);

		//the MongoDB query
		const records = await CatchRecord.find({
			weekEndDate: { $regex: regex },
		})
			.limit(Number(pageSize))
			.skip(skipCount)
			.populate("vessel", "name");

		if (!records || records.length === 0) {
			return res.status(404).send("No catch records found for the given year");
		}

		console.log("First record returned:", records[0]); // Log the first record returned

		res.json(records);
	} catch (error) {
		console.error("Error in /catchrecords/year route:", error);
		res.status(500).send("Internal Server Error");
	}
});

//Getting catch records by month and date range.
// Getting catch records by month and date range.
router.get("/catchrecords/daterange", async (req, res) => {
	try {
		// Extract query parameters
		const {
			startMonth,
			startYear,
			endMonth,
			endYear,
			page = 0,
			pageSize = 10,
		} = req.query;

		// Validate input parameters
		if (!startMonth || !startYear || !endMonth || !endYear) {
			return res
				.status(400)
				.json({ error: "Start and end month and year are required" });
		}

		// Convert input dates to JavaScript Date objects
		const startDate = new Date(
			`${startYear}-${startMonth.padStart(2, "0")}-01`
		);
		let endDate = new Date(`${endYear}-${endMonth.padStart(2, "0")}-01`);
		endDate.setMonth(endDate.getMonth() + 1); // Move to the first day of the next month

		const skipCount = Number(page) * Number(pageSize);

		// Aggregation pipeline for querying the records
		const aggregationPipeline = [
			{
				// Step 1: Correct the date format by prepending '20' to the year
				$addFields: {
					correctedDate: {
						$concat: ["20", "$weekEndDate"], // Prepend '20' to the existing date string
					},
				},
			},
			{
				// Step 2: Convert the corrected string to a date object
				$addFields: {
					convertedDate: {
						$dateFromString: {
							dateString: "$correctedDate",
							format: "%Y/%m/%d", // Using a four-digit year format
						},
					},
				},
			},
			{
				// Step 3: Filter documents based on the converted date
				$match: {
					convertedDate: {
						$gte: startDate, // startDate should be a JavaScript Date object
						$lt: endDate, // endDate should be a JavaScript Date object
					},
				},
			},
			{
				// Step 4: Skip documents for pagination
				$skip: skipCount,
			},
			{
				// Step 5: Limit the number of documents
				$limit: Number(pageSize),
			},
			// Add additional stages if necessary
		];

		// Execute the aggregation pipeline
		const records = await CatchRecord.aggregate(aggregationPipeline);

		// Handle the case where no records are found
		if (!records || records.length === 0) {
			return res.status(200).json({
				message: "No catch records found for the given date range",
				data: [],
			});
		}

		// Return the found records
		res.json({ message: "Success", data: records });
	} catch (error) {
		console.error("Error in /catchrecords/daterange route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
