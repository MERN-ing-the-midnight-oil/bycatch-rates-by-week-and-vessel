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
router.get("/catchrecords/daterange", async (req, res) => {
	try {
		const {
			startMonth,
			startYear,
			endMonth,
			endYear,
			page = 0,
			pageSize = 10,
		} = req.query;

		// Log received parameters
		console.log("Received parameters:");
		console.log("Start Month:", startMonth);
		console.log("Start Year:", startYear);
		console.log("End Month:", endMonth);
		console.log("End Year:", endYear);
		console.log("Page:", page);
		console.log("Page Size:", pageSize);

		if (!startMonth || !startYear || !endMonth || !endYear) {
			return res.status(400).send("Start and end month and year are required");
		}

		// Convert 4-digit year to 2-digit format and construct date strings in YY/MM/DD format
		const startYearShort = startYear.slice(-2);
		const endYearShort = endYear.slice(-2);
		const startDateStr = `${startYearShort}/${startMonth}/01`;
		const endDateStr = `${endYearShort}/${endMonth}/01`;

		// Log constructed date strings
		console.log("Constructed Start Date String:", startDateStr);
		console.log("Constructed End Date String:", endDateStr);

		// Adjust endDateStr to the first day of the next month in YY/MM/DD format
		const endDate = new Date(`${endYear}-${endMonth}-01`);
		endDate.setMonth(endDate.getMonth() + 1);
		const endMonthStr = ("0" + (endDate.getMonth() + 1)).slice(-2);
		const adjustedEndYearStr = endDate.getFullYear().toString().slice(-2);
		const adjustedEndDateStr = `${adjustedEndYearStr}/${endMonthStr}/01`;

		// Log adjusted end date string
		console.log("Adjusted End Date String:", adjustedEndDateStr);

		const skipCount = Number(page) * Number(pageSize);

		const records = await CatchRecord.find({
			weekEndDate: {
				$gte: startDateStr,
				$lt: adjustedEndDateStr,
			},
		})
			.limit(Number(pageSize))
			.skip(skipCount)
			.populate("vessel", "name");

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
