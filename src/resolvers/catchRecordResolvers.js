const CatchRecord = require("../models/catchRecordModel");
const Vessel = require("../models/VesselModel");

const catchRecordResolvers = {
	Query: {
		//finds the vessel then uses an aggregation pipeline  to match records with the vessel, project a new field by extracting the month from weekEndDate, matches records where "month" is within the specified range.
		getRecordsByVesselAndMonthRange: async (
			_,
			{ startMonth, endMonth, vesselName, page = 0, pageSize = 10 }
		) => {
			try {
				console.log(
					`Received query with parameters: startMonth=${startMonth}, endMonth=${endMonth}, vesselName=${vesselName}, page=${page}, pageSize=${pageSize}`
				);

				const vessel = await Vessel.findOne({ name: vesselName });
				if (!vessel) {
					throw new Error("Vessel not found");
				}

				const records = await CatchRecord.aggregate([
					{ $match: { vessel: vessel._id } },
					{ $project: { month: { $month: "$weekEndDate" }, data: "$$ROOT" } },
					{ $match: { month: { $gte: startMonth, $lte: endMonth } } },
					{ $skip: page * pageSize },
					{ $limit: pageSize },
					{
						$lookup: {
							from: "vessels",
							localField: "data.vessel",
							foreignField: "_id",
							as: "vesselInfo",
						},
					},
					{ $unwind: "$vesselInfo" },
					{ $addFields: { "data.vessel": "$vesselInfo" } },
					{ $replaceRoot: { newRoot: "$data" } },
				]).exec();

				// Convert Date objects to strings
				records.forEach((record) => {
					record.weekEndDate = record.weekEndDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
				});

				// Log the first and last fetched records
				if (records.length > 0) {
					console.log("First fetched record:");
					console.log(records[0]);

					console.log("Last fetched record:");
					console.log(records[records.length - 1]);
				} else {
					console.log("No records found.");
				}

				return records;
			} catch (error) {
				console.error(`Error fetching catch records: ${error}`);
				throw new Error(`Error fetching catch records`);
			}
		},

		getRecordsForChartByVesselAndMonthRange: async (
			_,
			{ startMonth, endMonth, vesselName }
		) => {
			try {
				const vessel = await Vessel.findOne({ name: vesselName });
				if (!vessel) {
					throw new Error("Vessel not found");
				}

				const currentYear = new Date().getFullYear();
				const startDate = new Date(currentYear, startMonth - 1, 1);
				const endDate = new Date(currentYear, endMonth, 0);

				const records = await CatchRecord.find({
					vessel: vessel._id,
					weekEndDate: {
						$gte: startDate,
						$lte: endDate,
					},
				})
					.sort({ weekEndDate: 1 })
					.populate("vessel")
					.lean(); // Using .lean() for performance optimization

				// Convert Date objects to strings
				records.forEach((record) => {
					record.weekEndDate = record.weekEndDate.toISOString().split("T")[0]; // Format as 'YYYY-MM-DD'
				});

				return records;
			} catch (error) {
				console.error(`Error fetching catch records for chart: ${error}`);
				throw new Error(`Error fetching catch records for chart`);
			}
		},
		getAllVessels: async () => {
			try {
				// Fetch all vessels and sort them by name in ascending order
				const vessels = await Vessel.find().sort({ name: 1 }).lean();
				return vessels.map((vessel) => ({
					id: vessel._id.toString(),
					name: vessel.name,
				}));
			} catch (error) {
				console.error(`Error fetching vessels: ${error}`);
				throw new Error(`Error fetching vessels`);
			}
		},
	},
	CatchRecord: {
		vessel: async (catchRecord) => {
			try {
				return await Vessel.findById(catchRecord.vessel);
			} catch (error) {
				console.error("Error fetching vessel:", error);
				throw new Error("Error fetching vessel");
			}
		},
	},
};

module.exports = catchRecordResolvers;
