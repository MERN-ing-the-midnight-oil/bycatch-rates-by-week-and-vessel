import React, { useState, useEffect } from "react";

import { useQuery, gql, useLazyQuery } from "@apollo/client";

import {
	FormControl,
	InputLabel,
	Select,
	MenuItem,
	Slider,
	Typography,
	Grid,
	Paper,
	Button,
} from "@mui/material";

import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";

const getYearMonthFromDateString = (dateStr) => {
	const match = dateStr.match(/^(\d{2})\/(\d{1,2})\/(\d{1,2})/);
	if (match) {
		return {
			year: 2000 + parseInt(match[1], 10),
			month: parseInt(match[2], 10),
			day: parseInt(match[3], 10),
		};
	}
	return null;
};

const transformDataForCharts = (rawData, startMonth, endMonth) => {
	console.log("Transforming Data", rawData);
	const speciesList = [
		"halibut",
		"herring",
		"redKingCrab",
		"otherKingCrab",
		"bairdiTanner",
		"otherTanner",
		"chinook",
		"nonChinook",
	];
	const transformed = speciesList.reduce((acc, species) => {
		acc[species] = {};

		rawData.forEach((record) => {
			const dateInfo = getYearMonthFromDateString(record.weekEndDate);
			if (
				dateInfo &&
				dateInfo.month >= startMonth &&
				dateInfo.month <= endMonth
			) {
				const yearKey = dateInfo.year;
				const normalizedDate = new Date(
					`2000-${dateInfo.month}-${dateInfo.day}`
				).getTime(); // Use fixed year

				if (!acc[species][yearKey]) {
					acc[species][yearKey] = [];
				}
				acc[species][yearKey].push({
					normalizedDate,
					catchValue: record[species] || 0,
				});
			}
		});

		return acc;
	}, {});

	return transformed;
};

// Defining my GraphQL queries, nearly the same as in RecordsBySeason
const GET_ALL_VESSELS = gql`
	query GetAllVessels {
		getAllVessels {
			id
			name
		}
	}
`;

const GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE = gql`
	query getRecordsForChartByVesselAndMonthRange(
		$startMonth: Int!
		$endMonth: Int!
		$vesselName: String!
	) {
		getRecordsForChartByVesselAndMonthRange(
			startMonth: $startMonth
			endMonth: $endMonth
			vesselName: $vesselName
		) {
			weekEndDate
			vessel {
				name
			}
			area
			gear
			target
			halibut
			herring
			redKingCrab
			otherKingCrab
			bairdiTanner
			otherTanner
			chinook
			nonChinook
			sampledHauls
		}
	}
`;

//THE COMPONENT
const RecordsBySeasonChart = () => {
	const [vesselName, setVesselName] = useState("");
	const [vessels, setVessels] = useState([]);
	const [startMonth, setStartMonth] = useState(1);
	const [endMonth, setEndMonth] = useState(12);
	const [dataBySpecies, setDataBySpecies] = useState({});

	// Fetch vessels list for drop down menu
	const { loading: loadingVessels, data: vesselsData } =
		useQuery(GET_ALL_VESSELS);

	useEffect(() => {
		if (vesselsData && vesselsData.getAllVessels) {
			setVessels(vesselsData.getAllVessels);
		}
	}, [vesselsData]);

	const formatSliderValue = (value) => {
		const monthNames = [
			"Jan",
			"Feb",
			"Mar",
			"Apr",
			"May",
			"Jun",
			"Jul",
			"Aug",
			"Sep",
			"Oct",
			"Nov",
			"Dec",
		];
		return monthNames[value - 1];
	};
	// useLazyQuery for fetching records
	const [getRecords, { loading, error }] = useLazyQuery(
		GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE,
		{
			//callback of the gql query
			onCompleted: (data) => {
				console.log("Data received:", data);
				const transformedData = transformDataForCharts(
					data.getRecordsForChartByVesselAndMonthRange,
					startMonth,
					endMonth
				);
				console.log("Transformed Data for Charts:", transformedData);
				setDataBySpecies(transformedData);
			},
			onError: (error) => {
				console.error("GraphQL Query Error:", error);
			},
		}
	);

	// Event handler for the "Submit" button
	const handleSubmit = () => {
		console.log("Submitting query with the following parameters:");
		console.log("Vessel Name:", vesselName);
		console.log("Start Month:", startMonth);
		console.log("End Month:", endMonth);

		getRecords({
			variables: {
				startMonth,
				endMonth,
				vesselName,
			},
		});
	};
	const yearColorMapping = {
		2013: "#ff6384", // Pink
		2014: "#36a2eb", // Blue
		2015: "#ffcd56", // Yellow
		2016: "#4bc0c0", // Teal
		2017: "#9966ff", // Purple
		2018: "#ff9f40", // Orange
		2019: "#ff6384", // Red
		2020: "#36a2eb", // Green
		2021: "#ffcd56", // Brown
		2022: "#4bc0c0", // Sky Blue
		2023: "#9966ff", // Magenta
	};
	//dateFormatter used by Xaxis
	const dateFormatter = (timestamp) => {
		const date = new Date(timestamp);
		return `${date.getMonth() + 1}/${date.getDate()}`; // Convert back to MM/DD format
	};
	return (
		<div>
			{loading && <p>Loading...</p>}
			{error && <p>Error: {error.message}</p>}

			<Typography variant="h6">Catch Records by Season</Typography>

			{/* Vessel Drop Down Menu */}
			<FormControl
				fullWidth
				sx={{ width: 300, mb: 2 }}>
				{" "}
				{/* Adjust width and margin-bottom */}
				<InputLabel id="vessel-select-label">Select a Vessel</InputLabel>
				<Select
					labelId="vessel-select-label"
					id="vessel-select"
					value={vesselName}
					label="Select a Vessel"
					onChange={(event) => setVesselName(event.target.value)}>
					{vessels.map((vessel) => (
						<MenuItem
							key={vessel.id}
							value={vessel.name}>
							{vessel.name}
						</MenuItem>
					))}
				</Select>
			</FormControl>

			{/* Month Range Slider */}
			<div
				style={{ maxWidth: "600px", margin: "0 auto", marginBottom: "20px" }}>
				<Typography
					id="month-range-slider"
					gutterBottom>
					Select Month Range
				</Typography>
				<Slider
					value={[startMonth, endMonth]}
					onChange={(event, newValue) => {
						console.log("Slider Values:", newValue);
						setStartMonth(newValue[0]);
						setEndMonth(newValue[1]);
					}}
					valueLabelDisplay="auto"
					min={1}
					max={12}
					marks
					step={1}
					valueLabelFormat={formatSliderValue}
					getAriaValueText={formatSliderValue}
					aria-labelledby="month-range-slider"
				/>
			</div>

			<Button
				variant="contained"
				onClick={handleSubmit}
				style={{ margin: "20px 0" }}>
				Submit
			</Button>

			{/* Display a chart for each species */}
			{Object.keys(dataBySpecies).map((species) => (
				<Paper
					key={species}
					style={{ margin: "20px", padding: "20px" }}>
					<Typography variant="h6">{`${species} Catch Records`}</Typography>
					<LineChart
						width={600}
						height={300}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis
							dataKey="normalizedDate"
							tickFormatter={dateFormatter}
							type="number"
							domain={["dataMin", "dataMax"]}
						/>
						<YAxis />
						<Tooltip />
						<Legend />
						{Object.keys(dataBySpecies[species]).map((year) => {
							// Sort the data for this year
							const sortedData = [...dataBySpecies[species][year]].sort(
								(a, b) => a.normalizedDate - b.normalizedDate
							);
							console.log(`Sorted Data for ${species} ${year}:`, sortedData);

							return (
								<Line
									key={year}
									type="monotone"
									data={sortedData}
									dataKey="catchValue"
									stroke={yearColorMapping[year] || "#000000"}
									name={`Year ${year}`}
								/>
							);
						})}
					</LineChart>
				</Paper>
			))}
		</div>
	);
};

export default RecordsBySeasonChart;
