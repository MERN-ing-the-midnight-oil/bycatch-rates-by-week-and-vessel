//entry point for my node.js server. responsible for setting up Apollo server and other backend logic.

const express = require("express");
const { ApolloServer } = require("apollo-server-express");
const path = require("path");

const { typeDefs, resolvers } = require("./src/schema"); // Assuming schema is at the root level

async function startServer() {
	const app = express();

	// Create an instance of ApolloServer
	const server = new ApolloServer({
		typeDefs,
		resolvers,
		// other configurations
	});

	await server.start();

	// Apply the Apollo GraphQL middleware and set the path to /api
	server.applyMiddleware({ app, path: "/api" });

	// Serve static files from the React app build directory
	app.use(express.static(path.join(__dirname, "build")));

	// The "catchall" handler for any requests that don't match one above
	// Send back React's index.html file.
	app.get("*", (req, res) => {
		res.sendFile(path.join(__dirname, "build", "index.html"));
	});

	// Set the port and start the server
	const PORT = process.env.PORT || 4000;
	app.listen(PORT, () =>
		console.log(
			`Server running on http://localhost:${PORT}${server.graphqlPath}`
		)
	);
}

startServer();
