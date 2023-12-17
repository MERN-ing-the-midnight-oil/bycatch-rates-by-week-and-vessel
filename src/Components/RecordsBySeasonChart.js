import React, { useState, useEffect } from "react";

// Apollo Client imports for GraphQL data fetching
import { useQuery, gql, useLazyQuery } from "@apollo/client";

// Material-UI components for UI elements
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

// Recharts for charting
import {
	LineChart,
	Line,
	XAxis,
	YAxis,
	CartesianGrid,
	Tooltip,
	Legend,
} from "recharts";

const transformDataForCharts = (rawData, startMonth, endMonth) => {
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
	const transformed = {};

	const getYearMonthFromDateString = (dateStr) => {
		const match = dateStr.match(/^(\d{2})\/(\d{2})\/(\d{2})/);
		return match
			? {
					year: 2000 + parseInt(match[1], 10),
					month: parseInt(match[2], 10),
					day: parseInt(match[3], 10),
			  }
			: null;
	};

	speciesList.forEach((species) => {
		transformed[species] = {};

		rawData.forEach((record) => {
			const dateInfo = getYearMonthFromDateString(record.weekEndDate);
			if (
				dateInfo &&
				dateInfo.month >= startMonth &&
				dateInfo.month <= endMonth
			) {
				const yearKey = dateInfo.year.toString();
				if (!transformed[species][yearKey]) {
					transformed[species][yearKey] = [];
				}
				transformed[species][yearKey].push({
					weekEndDate: record.weekEndDate,
					catchValue: record[species] || 0,
				});
			}
		});
	});

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
		$vesselName: String
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
	const [data, setData] = useState([]);
	const [vesselName, setVesselName] = useState("");
	const [vessels, setVessels] = useState([]);
	const [startMonth, setStartMonth] = useState(1);
	const [endMonth, setEndMonth] = useState(12);

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
	//useLazyQuery is used to define the getRecords function, The query will be executed when handleSubmit is called when the user clicks submit.
	const [getRecords, { loading, data: queryData, error }] = useLazyQuery(
		GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE,
		{
			onCompleted: (data) => {
				console.log(
					"Raw Data returned by GET_RECORDS:",
					data.getRecordsByVesselAndMonthRange
				);
				setData(data.getRecordsByVesselAndMonthRange);
			},
			onError: (error) => {
				console.error("GraphQL Query Error:", error);
			},
		}
	);

	// State to hold the transformed data for charts
	const [dataBySpecies, setDataBySpecies] = useState({});

	// useEffect to transform data for charts
	useEffect(() => {
		if (queryData && queryData.getRecordsByVesselAndMonthRange) {
			const transformedData = transformDataForCharts(
				queryData.getRecordsByVesselAndMonthRange,
				startMonth,
				endMonth
			);
			console.log("Transformed Data:", transformedData);
			setDataBySpecies(transformedData);
		}
	}, [queryData, startMonth, endMonth]);

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

	return (
		<div>
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
						data={dataBySpecies[species]}
						margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
						<CartesianGrid strokeDasharray="3 3" />
						<XAxis dataKey="weekEndDate" />
						<YAxis />
						<Tooltip />
						<Legend />
						{Object.keys(dataBySpecies[species]).map((year) => (
							<Line
								key={year}
								type="monotone"
								dataKey={`${year}.catchValue`}
								stroke={yearColorMapping[year] || "#000000"} // Fallback to a default color if year is not in the mapping
								name={`Year ${year}`}
							/>
						))}
					</LineChart>
				</Paper>
			))}
		</div>
	);
};

export default RecordsBySeasonChart;