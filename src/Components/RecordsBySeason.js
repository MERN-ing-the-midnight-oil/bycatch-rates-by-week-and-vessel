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
import { format } from "date-fns";

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
		$vesselName: String!
		$page: Int
		$pageSize: Int
	) {
		getRecordsByVesselAndMonthRange(
			startMonth: $startMonth
			endMonth: $endMonth
			vesselName: $vesselName
			page: $page
			pageSize: $pageSize
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
	const [isTableVisible, setIsTableVisible] = useState(true);

	const handlePageSizeChange = (event) => {
		setPageSize(event.target.value);
		setPage(0); // Reset to the first page whenever page size changes
	};

	// 	The first useEffect is responsible for triggering the fetchData function whenever the page state changes.
	// The second useEffect watches for changes in queryData and updates the component's data state accordingly.
	// This ensures that every time the page number changes, a new query is made with the updated page value, and the component's state is updated when new data is fetched.
	const [getRecords, { data: queryData, error: queryError }] = useLazyQuery(
		GET_RECORDS_BY_VESSEL_AND_MONTH_RANGE
	);

	// Fetch data when component mounts and when 'page' changes
	useEffect(() => {
		const fetchData = () => {
			console.log("Fetching data with variables:", {
				startMonth,
				endMonth,
				vesselName,
				page,
				pageSize,
			});
			getRecords({
				variables: {
					startMonth,
					endMonth,
					vesselName,
					page,
					pageSize,
				},
			});
		};

		fetchData();
	}, [page, getRecords, startMonth, endMonth, vesselName, pageSize]);

	// Update the data when new query data is received
	useEffect(() => {
		if (queryData && queryData.getRecordsByVesselAndMonthRange) {
			setData(queryData.getRecordsByVesselAndMonthRange);
		}
	}, [queryData]);

	const columnHelper = createColumnHelper();
	const columns = [
		columnHelper.accessor("weekEndDate", {
			header: "Week End Date",
			cell: (info) => {
				const dateStr = info.getValue();
				try {
					// Parse the ISO date string and format it
					const date = new Date(dateStr);
					return format(date, "PPP"); // e.g., "April 29, 2023"
				} catch (error) {
					console.error("Error formatting date:", error);
					return dateStr; // Fallback to the original string in case of an error
				}
			},
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
		console.log("Submitting query with variables:", {
			startMonth,
			endMonth,
			vesselName,
			page,
			pageSize,
		});
		getRecords({
			variables: {
				startMonth,
				endMonth,
				vesselName,
				page,
				pageSize,
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

	const toggleTableVisibility = () => {
		setIsTableVisible(!isTableVisible);
	};

	return (
		<div>
			{queryError && <div>Error: {queryError.message}</div>}

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
				{/* Conditional Rendering of the Table */}
				{isTableVisible && (
					<>
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
												{flexRender(
													cell.column.columnDef.cell,
													cell.getContext()
												)}
											</TableCell>
										))}
									</TableRow>
								))}
							</TableBody>
						</Table>
					</>
				)}
				{data && data.length > 0 && (
					<div
						style={{
							marginTop: "20px",
							display: "flex",
							justifyContent: "space-between",
						}}>
						{/* Optionally, display current page and total records here */}
					</div>
				)}{" "}
				<div
					style={{
						marginTop: "20px",
						display: "flex",
						justifyContent: "space-between",
					}}>
					{/* Page Size Selector */}
					<FormControl>
						<InputLabel id="page-size-label">Page Size</InputLabel>
						<Select
							labelId="page-size-label"
							value={pageSize}
							onChange={handlePageSizeChange}>
							{[10, 20, 30, 50].map((size) => (
								<MenuItem
									key={size}
									value={size}>
									{size}
								</MenuItem>
							))}
						</Select>
					</FormControl>

					{/* Pagination Buttons */}
					<div>
						{/* Toggle Table Visibility Button */}
						<Button
							variant="contained"
							color="primary"
							onClick={toggleTableVisibility}
							style={{ marginBottom: "10px" }}>
							{isTableVisible ? "Hide Table" : "Show Table"}
						</Button>
						<Button
							variant="contained"
							onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
							disabled={page === 0}>
							Previous Page
						</Button>
						<Button
							variant="contained"
							style={{ marginLeft: "10px" }}
							onClick={() => setPage((prev) => prev + 1)}>
							Next Page
						</Button>
						{/* Optionally, display current page and total records here */}
					</div>
				</div>
			</Paper>
		</div>
	);
}

export default RecordsBySeason;
