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
			<div style={{ textAlign: "center" }}>
				<h1>NOAA fisheries BSAI/GOA Bycatch Rates Widget</h1>
				<img
					src="https://cdn.midjourney.com/ea93088a-3701-47ef-b68b-2711c280f77d/0_0.webp"
					style={{ width: "auto", height: 200 }}
					alt="A fishing trawler enmeshed in a fractally network of data points"
				/>
			</div>
			<h2>
				View All Catch Records By Year or Date Range (2013-2023){" "}
				<button onClick={toggleCatchDataVisibility}>
					{showCatchData ? "Hide This Feature" : "Show This Feature"}
				</button>
			</h2>
			{showCatchData && (
				<div>
					<CatchDataComponent />
				</div>
			)}
			<h2>
				Create Multi-year Bycatch Comparisons by Fishing Vessel and Species{" "}
				<button onClick={toggleBycatchBySeasonVisibility}>
					{showBycatchBySeason ? "Hide This Feature" : "Show This Feature"}
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
			)}{" "}
			<div>
				<h2
					style={{
						position: "absolute",
						bottom: 0,
						width: "100%",
						textAlign: "center",
						margin: 0,
					}}>
					{
						"All 'bycatch rates by week and vessel' data used by this widget are from "
					}
					<a
						href="https://www.fisheries.noaa.gov/alaska/commercial-fishing/fisheries-catch-and-landings-reports-alaska#bsai-prohibited-species"
						target="_blank"
						rel="noopener noreferrer">
						this NOAA website.
					</a>
				</h2>
			</div>
		</div>
	);
}

export default Dashboard;
