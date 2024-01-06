const Vessel = require("../models/VesselModel");

const vesselResolvers = {
	Query: {
		// Fetch a single vessel by its ID
		getVesselById: async (_, { id }) => {
			try {
				return await Vessel.findById(id);
			} catch (error) {
				console.error(`Error fetching vessel with id ${id}:`, error);
				throw new Error(`Error fetching vessel with id ${id}`);
			}
		},
	},
	// Add more resolvers for other fields or queries as needed
};

module.exports = vesselResolvers;
