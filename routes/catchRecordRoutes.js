//This file contains my Express routes (router.get endpoints) that handle HTTP GET requests. Each route is designed to respond to a specific URL path and HTTP method.

const express = require("express");
const router = express.Router();
const CatchRecord = require("../src/models/catchRecordModel");

router.get("/catchrecords/year", async (req, res) => {
	try {
		const { year, page = 0, pageSize = 10 } = req.query;
		console.log("/catchrecords/year route is being used");
		console.log("Year being queried:", year);

		if (!year) {
			return res.status(400).send("Year is required");
		}

		const skipCount = Number(page) * Number(pageSize);
		const startDate = new Date(`${year}-01-01T00:00:00.000Z`);
		const endDate = new Date(`${parseInt(year) + 1}-01-01T00:00:00.000Z`);

		console.log("Query Start Date:", startDate);
		console.log("Query End Date:", endDate);

		const records = await CatchRecord.find({
			weekEndDate: { $gte: startDate, $lt: endDate },
		})
			.limit(Number(pageSize))
			.skip(skipCount)
			.populate("vessel", "name");

		console.log(`Number of records found: ${records.length}`);
		if (records.length > 0) {
			console.log("First record returned:", records[0]);
		}

		if (!records || records.length === 0) {
			return res.status(404).send("No catch records found for the given year");
		}

		res.json(records);
	} catch (error) {
		console.error("Error in /catchrecords/year route:", error);
		res.status(500).send("Internal Server Error");
	}
});

//----------------------------------------------------------------
//---------------// Getting catch records by month and date range.
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

		// Log the received date range parameters
		console.log("Received Date Range:");
		console.log("Start Year/Month:", startYear + "/" + startMonth);
		console.log("End Year/Month:", endYear + "/" + endMonth);

		// Validate input parameters
		if (!startMonth || !startYear || !endMonth || !endYear) {
			return res
				.status(400)
				.json({ error: "Start and end month and year are required" });
		}

		// Convert start and end dates to JavaScript Date objects
		const startDate = new Date(
			`${startYear}-${startMonth.padStart(2, "0")}-01`
		);
		const endDate = new Date(`${endYear}-${endMonth.padStart(2, "0")}-01`);
		endDate.setMonth(endDate.getMonth() + 1, 0); // Set to the last day of the end month

		// Calculate pagination skip count
		const skipCount = Number(page) * Number(pageSize);

		// Query the database
		const records = await CatchRecord.find({
			weekEndDate: {
				$gte: startDate,
				$lte: endDate,
			},
		})
			.limit(Number(pageSize))
			.skip(skipCount)
			.populate("vessel", "name");

		// Log the number of records returned
		console.log("Number of Records Returned:", records.length);

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
