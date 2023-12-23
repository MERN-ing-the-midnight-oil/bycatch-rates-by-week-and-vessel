import React, { useState } from "react";
import RecordsByYear from "./RecordsByYear"; // Adjust the path as necessary
import RecordsBySeason from "./RecordsBySeason";
import RecordsBySeasonChart from "./RecordsBySeasonChart"; // Adjust the path as necessary

function Dashboard() {
	// State to control the visibility of RecordsByYear (not shown by default)
	const [showCatchData, setShowCatchData] = useState(false);

	// Function to toggle the visibility of RecordsByYear
	const toggleCatchDataVisibility = () => {
		setShowCatchData(!showCatchData);
	};

	// State to control the visibility of RecordsBySeason (not shown by default)
	const [showRecordsBySeason, setShowRecordsBySeason] = useState(false);

	// Function to toggle the visibility of RecordsBySeason
	const toggleRecordsBySeasonVisibility = () => {
		setShowRecordsBySeason(!showRecordsBySeason);
	};

	// State to control the visibility of the third feature, RecordsBySeasonChart (not shown by default)
	const [showRecordsBySeasonChart, setShowRecordsBySeasonChart] =
		useState(false);

	// Function to toggle the visibility of RecordsBySeasonChart
	const toggleRecordsBySeasonChartVisibility = () => {
		setShowRecordsBySeasonChart(!showRecordsBySeasonChart);
	};
	return (
		<div
			style={{
				display: "flex",
				flexDirection: "column",
				minHeight: "100vh",
				padding: "20px", // Add padding here
			}}>
			<div style={{ flex: "1" }}>
				{/* Header and Image */}
				<div style={{ textAlign: "center" }}>
					<h1>NOAA fisheries BSAI/GOA Bycatch Rates Widget</h1>
					<img
						src="https://cdn.midjourney.com/ea93088a-3701-47ef-b68b-2711c280f77d/0_0.webp"
						style={{ width: "auto", height: 200 }}
						alt="A fishing trawler enmeshed in a fractally network of data points"
					/>
				</div>

				{/* First Feature */}
				<h2 title="uses RESTful API calls">
					View All Catch Records By Year or Date Range (2013-2023){" "}
					<button onClick={toggleCatchDataVisibility}>
						{showCatchData ? "Hide This Feature" : "Show This Feature"}
					</button>
				</h2>
				{showCatchData && (
					<div>
						<RecordsByYear />
					</div>
				)}

				{/* Second Feature */}
				<h2 title="uses graphql API calls">
					Catch Records by vessel name and season (month range){" "}
					<button onClick={toggleRecordsBySeasonVisibility}>
						{showRecordsBySeason ? "Hide This Feature" : "Show This Feature"}
					</button>
				</h2>
				<p>
					{showRecordsBySeason &&
						"Use this visualizer to compare a vessel's year-to-year catch records by time of year."}
				</p>
				{showRecordsBySeason && (
					<div>
						<RecordsBySeason />
					</div>
				)}
				{/* Third Feature */}
				<h2 title="Charting catch records by vessel name and season">
					Charting Catch Records by Vessel Name and Season{" "}
					<button onClick={toggleRecordsBySeasonChartVisibility}>
						{showRecordsBySeasonChart
							? "Hide This Feature"
							: "Show This Feature"}
					</button>
				</h2>
				<p>
					{showRecordsBySeasonChart &&
						"Explore the catch records in a chart format to visualize trends and comparisons over time."}
				</p>
				{showRecordsBySeasonChart && (
					<div>
						<RecordsBySeasonChart />
					</div>
				)}
			</div>

			{/* Footer */}
			<footer style={{ textAlign: "center", margin: "10px 0" }}>
				<h2>
					{
						"All data used by this widget are from the `bycatch rates by week and vessel' section of "
					}
					<a
						href="https://www.fisheries.noaa.gov/alaska/commercial-fishing/fisheries-catch-and-landings-reports-alaska#bsai-prohibited-species"
						target="_blank"
						rel="noopener noreferrer">
						this NOAA website.
					</a>
				</h2>
			</footer>
		</div>
	);
}

export default Dashboard;
