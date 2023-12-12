import React, { useState, useEffect } from "react";
import { useQuery, useLazyQuery, gql } from "@apollo/client";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
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
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
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

function RecordsBySeason() {
	const [data, setData] = useState([]);
	const [vesselName, setVesselName] = useState("");
	const [vessels, setVessels] = useState([]);
	const [startMonth, setStartMonth] = useState(1);
	const [endMonth, setEndMonth] = useState(12);
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const [
		getRecords,
		{ loading: queryLoading, data: queryData, error: queryError },
	] = useLazyQuery(GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE);

	useEffect(() => {
		if (queryData && queryData.getRecordsByVesselAndMonthRange) {
			setData(queryData.getRecordsByVesselAndMonthRange);
		}
	}, [queryData]);

	const columnHelper = createColumnHelper();
	const columns = [
		columnHelper.accessor("weekEndDate", {
			header: "Week End Date",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor((row) => row.vessel.name, {
			id: "vessel",
			header: "Vessel",
		}),

		columnHelper.accessor("area", {
			header: "Area",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("gear", {
			header: "Gear",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("target", {
			header: "Target",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("halibut", {
			header: "Halibut",
			cell: (info) => info.getValue().toFixed(2),
		}),
		columnHelper.accessor("herring", {
			header: "Herring",
			cell: (info) => info.getValue().toFixed(2),
		}),
		columnHelper.accessor("redKingCrab", {
			header: "Red King Crab",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("otherKingCrab", {
			header: "Other King Crab",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("bairdiTanner", {
			header: "Bairdi Tanner",
			cell: (info) => info.getValue().toFixed(2),
		}),
		columnHelper.accessor("otherTanner", {
			header: "Other Tanner",
			cell: (info) => info.getValue().toFixed(2),
		}),
		columnHelper.accessor("chinook", {
			header: "Chinook",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("nonChinook", {
			header: "Non-Chinook",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("sampledHauls", {
			header: "Sampled Hauls",
			cell: (info) => info.getValue(),
		}),
	];

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

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

	const { loading, error } = useQuery(GET_ALL_VESSELS, {
		onCompleted: (data) => setVessels(data.getAllVessels),
	});

	return (
		<div>
			<Paper style={{ margin: "20px", padding: "20px", overflowX: "auto" }}>
				{loading && <div>Loading vessels...</div>}
				{error && <div>Error: {error.message}</div>}
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

				<Table>
					<TableHead>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => (
									<TableCell
										key={header.id}
										style={{ fontWeight: "bold" }}>
										{flexRender(
											header.column.columnDef.header,
											header.getContext()
										)}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableHead>
					<TableBody>
						{table.getRowModel().rows.map((row, rowIndex) => (
							<TableRow
								key={row.id}
								style={{
									backgroundColor: rowIndex % 2 === 0 ? "#f7f7f7" : "white",
								}}>
								{row.getVisibleCells().map((cell) => (
									<TableCell key={cell.id}>
										{flexRender(cell.column.columnDef.cell, cell.getContext())}
									</TableCell>
								))}
							</TableRow>
						))}
					</TableBody>
				</Table>
				{/* Pagination and other components */}
			</Paper>
		</div>
	);
}

export default RecordsBySeason;
