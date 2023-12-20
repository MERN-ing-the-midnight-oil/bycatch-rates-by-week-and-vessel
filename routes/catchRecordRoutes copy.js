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
		const {
			startMonth,
			startYear,
			endMonth,
			endYear,
			page = 0,
			pageSize = 10,
		} = req.query;

		// Log received parameters
		console.log("Received parameters in daterange route:");
		console.log("Start Month:", startMonth);
		console.log("Start Year:", startYear);
		console.log("End Month:", endMonth);
		console.log("End Year:", endYear);
		console.log("Page:", page);
		console.log("Page Size:", pageSize);

		// Validate input parameters
		if (!startMonth || !startYear || !endMonth || !endYear) {
			console.log(
				"Validation Error: Start and end month and year are required"
			);
			return res
				.status(400)
				.json({ error: "Start and end month and year are required" });
		}

		// Convert 4-digit year to 2-digit format and construct date strings in YY/MM/DD format
		const startYearShort = startYear.slice(-2);
		const endYearShort = endYear.slice(-2);
		const startDateStr = `${startYearShort}/${startMonth}/01`;

		let adjustedEndDateStr;

		if (startYear === endYear && startMonth === endMonth) {
			// If the date range is within the same month and year
			const endDate = new Date(`${endYear}-${endMonth}-01`);
			endDate.setMonth(endDate.getMonth() + 1, 0); // Set to the last day of the month
			const endMonthStr = ("0" + (endDate.getMonth() + 1)).slice(-2);
			const adjustedEndYearStr = endDate.getFullYear().toString().slice(-2);
			adjustedEndDateStr = `${adjustedEndYearStr}/${endMonthStr}/${endDate.getDate()}`;
		} else {
			// Original logic for different months or years
			const endDate = new Date(`${endYear}-${endMonth}-01`);
			endDate.setMonth(endDate.getMonth() + 1);
			const endMonthStr = ("0" + (endDate.getMonth() + 1)).slice(-2);
			const adjustedEndYearStr = endDate.getFullYear().toString().slice(-2);
			adjustedEndDateStr = `${adjustedEndYearStr}/${endMonthStr}/01`;
		}

		// Log the query parameters
		console.log("Querying database with:", {
			startDate: startDateStr,
			endDate: adjustedEndDateStr,
			skipCount: Number(page) * Number(pageSize),
			pageSize: Number(pageSize),
		});

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
			console.log("No catch records found for the given date range");
			return res.status(200).json({
				message: "No catch records found for the given date range",
				data: [],
			});
		}

		console.log(`Found ${records.length} records`);
		res.json({ message: "Success", data: records });
	} catch (error) {
		console.error("Error in /catchrecords/daterange route:", error);
		res.status(500).json({ error: "Internal Server Error" });
	}
});

module.exports = router;
