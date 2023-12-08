import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import {
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Paper,
	Grid,
	Button,
	Slider,
	Typography,
} from "@mui/material";

const GET_ALL_VESSELS = gql`
	query GetAllVessels {
		getAllVessels {
			id
			name
		}
	}
`;

const GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE = gql`
	query GetRecordsByVesselAndMonthRange(
		$startMonth: Int!
		$endMonth: Int!
		$vesselName: String
	) {
		getRecordsByVesselAndMonthRange(
			startMonth: $startMonth
			endMonth: $endMonth
			vesselName: $vesselName
		) {
			id
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

function BycatchBySeason() {
	const [vesselName, setVesselName] = useState("");
	const [vessels, setVessels] = useState([]);
	const [startMonth, setStartMonth] = useState(1);
	const [endMonth, setEndMonth] = useState(12);

	const [
		getRecords,
		{ loading: queryLoading, data: queryData, error: queryError },
	] = useLazyQuery(GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE);

	useEffect(() => {
		if (queryData) {
			console.log("Fetched Data:", queryData);
			// Additional logic to handle fetched data
		}
	}, [queryData]);

	const handleSubmit = (event) => {
		event.preventDefault();
		getRecords({
			variables: {
				startMonth,
				endMonth,
				vesselName,
			},
		});
	};

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

	const { loading, error, data } = useQuery(GET_ALL_VESSELS);

	useEffect(() => {
		if (data && data.getAllVessels) {
			setVessels(data.getAllVessels);
		}
	}, [data]);

	return (
		<Paper style={{ padding: "20px", margin: "20px 0" }}>
			{/* Show loading indicator when query is in progress */}
			{queryLoading && <div>Loading...</div>}

			{/* Display error message if query fails */}
			{queryError && <div>Error: {queryError.message}</div>}

			<form onSubmit={handleSubmit}>
				<Grid
					container
					spacing={2}>
					{/* Vessel Name Dropdown */}
					<Grid
						item
						xs={12}
						md={6}>
						<FormControl fullWidth>
							<InputLabel>Vessel Name</InputLabel>
							<Select
								value={vesselName}
								label="Vessel Name"
								onChange={(e) => setVesselName(e.target.value)}>
								{vessels.map((vessel) => (
									<MenuItem
										key={vessel.id}
										value={vessel.name}>
										{vessel.name}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>

					{/* Month Range Slider */}
					<Grid
						item
						xs={12}>
						<Typography
							id="month-range-slider"
							gutterBottom>
							Select Month Range
						</Typography>
						<Slider
							value={[startMonth, endMonth]}
							onChange={(event, newValue) => {
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
					</Grid>

					{/* Submit Button */}
					<Grid
						item
						xs={12}>
						<Button
							type="submit"
							variant="contained"
							color="primary">
							Submit
						</Button>
					</Grid>
				</Grid>
			</form>
		</Paper>
	);
}

export default BycatchBySeason;
