import React from "react";
import "./App.css";
import Dashboard from "./Components/Dashboard";
import { ApolloProvider } from "@apollo/client";
import client from "./apolloClient"; // Import the Apollo Client instance

function App() {
	return (
		<ApolloProvider client={client}>
			{" "}
			{/* Wrap with ApolloProvider */}
			<div className="App">
				<Dashboard />
			</div>
		</ApolloProvider>
	);
}

export default App;
