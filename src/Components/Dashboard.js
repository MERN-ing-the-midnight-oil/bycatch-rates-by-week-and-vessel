import React from "react";
import CatchDataComponent from "./CatchDataComponent"; // Adjust the path as necessary

function Dashboard() {
	return (
		<div>
			<h1>Fisheries Data Dashboard</h1>
			<div>
				<h2>Catch Records</h2>
				<CatchDataComponent />
			</div>
			{/* Future components can be added here */}
			{/* For example, a component to filter data based on certain criteria */}
			{/* Or a component to display summary statistics or graphs */}
		</div>
	);
}

export default Dashboard;
