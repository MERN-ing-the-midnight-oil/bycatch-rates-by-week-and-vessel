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
			{ startMonth, endMonth, vesselName }
		) => {
			try {
				// Find the vessel by name
				const vessel = await Vessel.findOne({ name: vesselName });
				if (!vessel) {
					throw new Error("Vessel not found");
				}

				// Fetch catch records for the specified vessel and month range
				return await CatchRecord.find({
					vessel: vessel._id,
					// Add logic to filter by month range
					// This will depend on the format of your 'weekEndDate' field and how the months are represented
				}).populate("vessel");
			} catch (error) {
				console.error("Error fetching catch records:", error);
				throw new Error("Error fetching catch records");
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
