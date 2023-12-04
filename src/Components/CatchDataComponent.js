import React, { useEffect, useState } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableRow,
	Paper,
	TextField,
	Button,
} from "@mui/material";

function CatchRecords() {
	const [data, setData] = useState([]);
	const [year, setYear] = useState(new Date().getFullYear());

	const [startDate, setStartDate] = useState("");
	const [endDate, setEndDate] = useState("");

	const columnHelper = createColumnHelper();
	const columns = [
		columnHelper.accessor("weekEndDate", {
			header: "Week End Date",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("vessel", {
			header: "Vessel",
			cell: (info) => info.getValue().name || "N/A", // Assuming the vessel object has a "name" property
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
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("herring", {
			header: "Herring",
			cell: (info) => info.getValue(),
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
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("otherTanner", {
			header: "Other Tanner",
			cell: (info) => info.getValue(),
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

	//state variables to manage the pagination
	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	useEffect(() => {
		fetchDataForYear(year);
	}, [year, page]); // Fetch data when the year changes

	const fetchDataForYear = async (selectedYear) => {
		try {
			const response = await fetch(
				`http://localhost:4000/api/catchrecords/year?year=${selectedYear}&page=${page}&pageSize=${pageSize}`
			);
			const fetchedData = await response.json();
			setData(fetchedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const fetchDataByDateRange = async () => {
		try {
			const url = `http://localhost:4000/api/catchrecords/daterange?startDate=${startDate}&endDate=${endDate}&page=${page}&pageSize=${pageSize}`;
			console.log("Fetching data from:", url);

			const response = await fetch(url);
			if (!response.ok) {
				throw new Error(`HTTP error! status: ${response.status}`);
			}

			const fetchedData = await response.json();
			setData(fetchedData); // Update the table data state
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	};

	const handleYearChange = (event) => {
		setYear(event.target.value);
	};
	const handlePageSizeChange = (event) => {
		setPageSize(parseInt(event.target.value, 10));
		setPage(0); // Reset to the first page whenever page size changes
	};

	const handleStartDateChange = (event) => {
		setStartDate(event.target.value);
	};

	const handleEndDateChange = (event) => {
		setEndDate(event.target.value);
	};

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<Paper style={{ margin: "20px", padding: "20px", overflowX: "auto" }}>
				<div style={{ marginBottom: "20px" }}>
					<TextField
						label="Enter a year (YYYY)"
						type="number"
						value={year}
						// the useEffect hook depends on the "year" state so it fetches data when the year changes
						onChange={handleYearChange}
						style={{ marginRight: "10px" }}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={() => fetchDataForYear(year)}>
						Fetch Data by year
					</Button>
				</div>
				{/* New Section for Start and End Date */}
				<div style={{ marginBottom: "20px" }}>
					<TextField
						label="Enter start date"
						type="date"
						value={startDate}
						onChange={handleStartDateChange}
						InputLabelProps={{
							shrink: true,
						}}
						style={{ marginRight: "10px" }}
					/>
					<TextField
						label="Enter end date"
						type="date"
						value={endDate}
						onChange={handleEndDateChange}
						InputLabelProps={{
							shrink: true,
						}}
						style={{ marginRight: "10px" }}
					/>
					<Button
						variant="contained"
						color="secondary"
						onClick={fetchDataByDateRange}>
						Fetch Data by Date Range
					</Button>
				</div>
				<div>
					{" "}
					<select
						value={pageSize}
						onChange={handlePageSizeChange}>
						{[10, 20, 50, 100].map((size) => (
							<option
								key={size}
								value={size}>
								Show {size} records per page
							</option>
						))}
					</select>
				</div>
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
				<div>
					<button
						onClick={() => setPage((prev) => Math.max(prev - 1, 0))}
						disabled={page === 0}>
						Previous Page
					</button>
					<button onClick={() => setPage((prev) => prev + 1)}>Next Page</button>
				</div>
			</Paper>
		</div>
	);
}

export default CatchRecords;
