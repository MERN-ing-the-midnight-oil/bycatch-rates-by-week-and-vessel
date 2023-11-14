const { gql } = require("apollo-server-express");
const fs = require("fs");
const path = require("path");

// Load type definitions from schema.graphql file
const typeDefs = gql(
	fs.readFileSync(path.join(__dirname, "typeDefs.graphql"), "utf-8")
);

const resolvers = {
	// Import your resolver functions here
	Query: {
		...require("../resolvers/vesselResolvers").Query,
		...require("../resolvers/catchRecordResolvers").Query,
	},
	Mutation: {
		...require("../resolvers/vesselResolvers").Mutation,
		...require("../resolvers/catchRecordResolvers").Mutation,
	},
	// You can also add resolvers for custom types if needed
};

module.exports = { typeDefs, resolvers };
