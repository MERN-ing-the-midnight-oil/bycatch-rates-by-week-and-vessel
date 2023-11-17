const Vessel = require("../models/VesselModel"); // Update the path according to your project structure

const vesselResolvers = {
	Query: {
		// Fetch all vessels or a specific number if a limit is provided
		getAllVessels: async (_, { limit }) => {
			try {
				const query = Vessel.find({});
				if (limit) {
					query.limit(limit);
				}
				return await query.exec();
			} catch (error) {
				console.error("Error fetching vessels:", error);
				throw new Error("Error fetching vessels");
			}
		},
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
