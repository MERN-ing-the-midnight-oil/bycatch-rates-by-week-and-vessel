//Resolvers handle the the fetching of data for fields in a query.  One for each field in the GraphQL schema.

const CatchRecord = require("../models/catchRecordModel");
const Vessel = require("../models/VesselModel");

const catchRecordResolvers = {
	Query: {
		// Fetch a limited number of catch records
		getCatchRecords: async (_, { limit = 10 }) => {
			// Default limit to 10 if not specified
			try {
				return await CatchRecord.find({}).limit(limit).populate("vessel");
			} catch (error) {
				console.error("Error fetching catch records:", error);
				throw new Error("Error fetching catch records");
			}
		},
		getRecordsByVesselAndMonthRange: async (
			_,
			{ startMonth, endMonth, vesselName, page = 0, pageSize = 10 }
		) => {
			try {
				// Find the vessel by name
				const vessel = await Vessel.findOne({ name: vesselName });
				if (!vessel) {
					throw new Error("Vessel not found");
				}

				// Fetch records where the month of weekEndDate falls within the specified range
				const records = await CatchRecord.find({
					vessel: vessel._id,
				}).populate("vessel");
				// Filter records based on month range
				const filteredRecords = records.filter((record) => {
					const month = parseInt(record.weekEndDate.split("/")[1], 10);
					return month >= startMonth && month <= endMonth;
				});

				// Implement Pagination
				const startIndex = page * pageSize;
				const endIndex = startIndex + pageSize;
				const paginatedRecords = filteredRecords.slice(startIndex, endIndex);

				return paginatedRecords;
			} catch (error) {
				console.error(`Error fetching catch records:`, error);
				throw new Error(`Error fetching catch records`);
			}
		},
	},
	CatchRecord: {
		// Resolver for the vessel field in CatchRecord if it's a reference
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
