import React, { useState } from "react";
import CatchDataComponent from "./CatchDataComponent"; // Adjust the path as necessary
import BycatchBySeason from "./BycatchBySeason";

function Dashboard() {
	// State to control the visibility of CatchDataComponent which is not shown by default
	const [showCatchData, setShowCatchData] = useState(false);

	// State to control the visibility of BycatchBySeason
	const [showBycatchBySeason, setShowBycatchBySeason] = useState(false);

	// Function to toggle the visibility of CatchDataComponent
	const toggleCatchDataVisibility = () => {
		setShowCatchData(!showCatchData);
	};

	// Function to toggle the visibility of BycatchBySeason
	const toggleBycatchBySeasonVisibility = () => {
		setShowBycatchBySeason(!showBycatchBySeason);
	};

	return (
		<div>
			<h1>NOAA fisheries BSAI/GOA Bycatch Rates Dashboard and visualizer</h1>

			<h2>
				View Catch Records By Year or Date Range (2013-2023){" "}
				<button onClick={toggleCatchDataVisibility}>
					{showCatchData ? "Hide Catch Records" : "Show Catch Records"}
				</button>
			</h2>
			{showCatchData && (
				<div>
					<CatchDataComponent />
				</div>
			)}

			<h2>
				Create Multi-year Bycatch Comparisons by Vessel and Species{" "}
				<button onClick={toggleBycatchBySeasonVisibility}>
					{showBycatchBySeason
						? "Hide Bycatch Comparisons"
						: "Show Bycatch Comparisons"}
				</button>
			</h2>
			<p>
				{showBycatchBySeason &&
					"Use this visualizer to compare year-to-year bycatch rates for a specific fishing vessel."}
			</p>
			{showBycatchBySeason && (
				<div>
					<BycatchBySeason />
				</div>
			)}
		</div>
	);
}

export default Dashboard;
