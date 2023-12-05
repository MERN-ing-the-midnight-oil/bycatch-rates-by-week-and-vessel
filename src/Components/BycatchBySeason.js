import React, { useState, useEffect } from "react";
import { useQuery, gql } from "@apollo/client";
import {
	Select,
	MenuItem,
	FormControl,
	InputLabel,
	Paper,
	Grid,
	Button,
	TextField,
} from "@mui/material";

// GraphQL query to get all vessels
const GET_ALL_VESSELS = gql`
	query GetAllVessels {
		getAllVessels {
			id
			name
		}
	}
`;

function BycatchBySeason() {
	const [vesselName, setVesselName] = useState("");
	const [targetSpecies, setTargetSpecies] = useState("");
	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");
	const [bycatchSpecies, setBycatchSpecies] = useState("");
	const [vessels, setVessels] = useState([]);

	const { loading, error, data } = useQuery(GET_ALL_VESSELS);

	useEffect(() => {
		if (data && data.getAllVessels) {
			setVessels(data.getAllVessels);
		}
	}, [data]);

	// Target species options
	const targetOptions = [
		"A Atka mackerel BSAI,GOA",
		"B Pollock - bottom* BSAI,GOA",
		"C Pacific cod BSAI,GOA",
		// ... include all other options here
	];
	const bycatchOptions = [
		"HALIBUT",
		"HERRING",
		"RED KING CRAB",
		"OTHER KING CRAB",
		"BAIRDI TANNER",
		"OTHER TANNER",
		"CHINOOK",
		"NON-CHINOOK",
	];

	const handleSubmit = (event) => {
		event.preventDefault();
		// Handle form submission
		console.log({ vesselName, targetSpecies, startDate, endDate });
	};

	return (
		<Paper style={{ padding: "20px", margin: "20px 0" }}>
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

					{/* Target Species Dropdown */}
					<Grid
						item
						xs={12}
						md={6}>
						<FormControl fullWidth>
							<InputLabel>Target Species</InputLabel>
							<Select
								value={targetSpecies}
								label="Target Species"
								onChange={(e) => setTargetSpecies(e.target.value)}>
								{targetOptions.map((option, index) => (
									<MenuItem
										key={index}
										value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					{/* Bycatch Species Dropdown */}
					<Grid
						item
						xs={12}
						md={6}>
						<FormControl fullWidth>
							<InputLabel>Bycatch Species</InputLabel>
							<Select
								value={bycatchSpecies}
								label="Bycatch Species"
								onChange={(e) => setBycatchSpecies(e.target.value)}>
								{bycatchOptions.map((option, index) => (
									<MenuItem
										key={index}
										value={option}>
										{option}
									</MenuItem>
								))}
							</Select>
						</FormControl>
					</Grid>
					{/* Date Pickers */}
					<Grid
						item
						xs={6}>
						<TextField
							fullWidth
							label="Start Date"
							type="date"
							InputLabelProps={{ shrink: true }}
							value={startDate}
							onChange={(e) => setStartDate(e.target.value)}
						/>
					</Grid>
					<Grid
						item
						xs={6}>
						<TextField
							fullWidth
							label="End Date"
							type="date"
							InputLabelProps={{ shrink: true }}
							value={endDate}
							onChange={(e) => setEndDate(e.target.value)}
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
