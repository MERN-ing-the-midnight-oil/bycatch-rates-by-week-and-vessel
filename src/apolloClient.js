// src/apolloClient.js
import { ApolloClient, InMemoryCache } from "@apollo/client";

const uri =
	process.env.REACT_APP_GRAPHQL_URI || "http://localhost:4000/graphql";

const client = new ApolloClient({
	uri: uri,
	cache: new InMemoryCache(),
});

export default client;
