import React, { useState, useEffect } from "react";

function CatchRecords() {
	const [records, setRecords] = useState([]);

	useEffect(() => {
		async function fetchData() {
			try {
				const response = await fetch("http://localhost:4000/api/catchrecords");
				if (!response.ok) {
					throw new Error("Network response was not ok");
				}
				const data = await response.json();
				setRecords(data);
			} catch (error) {
				console.error("Fetch error:", error);
			}
		}

		fetchData();
	}, []);

	return (
		<div>
			<h1>Catch Records</h1>
			<ul>
				{records.map((record) => (
					<li key={record._id}>
						Date: {record.weekEndDate}, Area: {record.area}, Halibut:{" "}
						{record.halibut} kg
					</li>
				))}
			</ul>
		</div>
	);
}

export default CatchRecords;
