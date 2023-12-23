require("dotenv").config();
const mongoose = require("mongoose");
const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const cors = require("cors");

const path = require("path");

const catchRecordRoutes = require("./routes/catchRecordRoutes");

const { typeDefs, resolvers } = require("./src/schema");

// || "mongodb://127.0.0.1:27017/bycatchDatabase",
async function connectToDatabase() {
	try {
		await mongoose.connect(
			process.env.MONGODB_URI, // Removed the local DB fallback
			{
				useNewUrlParser: true,
				useUnifiedTopology: true,
			}
		);
		console.log("Successfully connected to MongoDB.");
	} catch (error) {
		console.error("Error connecting to MongoDB:", error.message);
		process.exit(1); // Optionally exit the application if the database connection fails
	}
}

async function startServer() {
	await connectToDatabase();

	const app = express();
	app.use(cors());

	// Define API routes
	app.use("/api", catchRecordRoutes);

	// Create an instance of ApolloServer
	const server = new ApolloServer({
		typeDefs,
		resolvers,
	});

	await server.start();

	// Apply the Apollo GraphQL middleware and set the path to /graphql
	server.applyMiddleware({ app, path: "/graphql" });

	// Serve static files from the React app build directory
	app.use(express.static(path.join(__dirname, "build")));

	// The "catchall" handler: send back React's index.html file.
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "build", "index.html"));
	});

	// Set the port and start the server
	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () => {
		console.log(
			`Server running on http://localhost:${PORT}${server.graphqlPath}`
		);
	});
}

startServer();
