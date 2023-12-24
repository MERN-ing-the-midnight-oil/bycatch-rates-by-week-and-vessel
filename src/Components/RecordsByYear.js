import React, { useEffect, useState, useCallback } from "react";
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
	FormControl,
	InputLabel,
	Select,
	MenuItem,
} from "@mui/material";

function CatchRecords() {
	const [data, setData] = useState([]);
	const [year, setYear] = useState(new Date().getFullYear());
	const [startMonth, setStartMonth] = useState("");
	const [startYear, setStartYear] = useState("");
	const [endMonth, setEndMonth] = useState("");
	const [endYear, setEndYear] = useState("");

	const [isFetchingByYear, setIsFetchingByYear] = useState(true); // flag to indicate fetch mode to prevent pagination from triggering fetching by year innapropriately

	const columnHelper = createColumnHelper();
	const columns = [
		columnHelper.accessor("weekEndDate", {
			header: "Week End Date",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("vessel", {
			header: "Vessel",
			cell: (info) => info.getValue().name || "N/A",
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

	const [page, setPage] = useState(0);
	const [pageSize, setPageSize] = useState(10);

	const fetchDataForYear = useCallback(async () => {
		if (!year) {
			console.error("Year is required");
			return;
		}
		try {
			const response = await fetch(
				`/api/catchrecords/year?year=${year}&page=${page}&pageSize=${pageSize}`
			);

			if (!response.ok) {
				const errorText = await response.text();
				throw new Error(`Error fetching data: ${response.status} ${errorText}`);
			}

			const fetchedData = await response.json();
			setData(fetchedData);
		} catch (error) {
			console.error("Error fetching data:", error);
		}
	}, [year, page, pageSize]);
	//deleted urp prefix http://localhost:4000, it should still work using relative paths
	const fetchDataByDateRange = useCallback(async () => {
		try {
			const url = `http://localhost:4000/api/catchrecords/daterange?startMonth=${startMonth}&startYear=${startYear}&endMonth=${endMonth}&endYear=${endYear}&page=${page}&pageSize=${pageSize}`;
			const response = await fetch(url);
			const responseJson = await response.json();

			if (!response.ok) {
				throw new Error(
					`HTTP error! status: ${response.status}. Message: ${
						responseJson.error || responseJson.message
					}`
				);
			}

			setData(responseJson.data);
			if (responseJson.data.length === 0) {
				alert(responseJson.message); // Alert if no data found
			}
		} catch (error) {
			console.error("Error fetching data:", error);
			alert(error.message);
		}
	}, [startMonth, startYear, endMonth, endYear, page, pageSize]);

	// Fetch data based on year selection
	useEffect(() => {
		if (isFetchingByYear) {
			fetchDataForYear();
		}
	}, [fetchDataForYear, isFetchingByYear]);

	// Fetch data based on date range selection
	useEffect(() => {
		if (!isFetchingByYear) {
			fetchDataByDateRange();
		}
	}, [fetchDataByDateRange, isFetchingByYear]);

	const handleYearChange = (event) => {
		setYear(event.target.value);
	};

	const handleStartMonthChange = (event) => {
		setStartMonth(event.target.value);
	};

	const handleStartYearChange = (event) => {
		setStartYear(event.target.value);
	};

	const handleEndMonthChange = (event) => {
		setEndMonth(event.target.value);
	};

	const handleEndYearChange = (event) => {
		setEndYear(event.target.value);
	};

	const handlePageSizeChange = (event) => {
		setPageSize(parseInt(event.target.value, 10));
		setPage(0); // Reset to the first page whenever page size changes
	};

	const handleFetchDataForYear = () => {
		setIsFetchingByYear(true);
		console.log(
			"Fetching data for year:",
			year,
			"Page:",
			page,
			"PageSize:",
			pageSize
		);
		fetchDataForYear(year);
	};
	const handleNextPage = () => {
		const nextPage = page + 1;
		console.log("Next Page:", nextPage);
		setPage(nextPage);
	};

	const handlePreviousPage = () => {
		const prevPage = Math.max(page - 1, 0);
		console.log("Previous Page:", prevPage);
		setPage(prevPage);
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
						onChange={handleYearChange}
						style={{ marginRight: "10px" }}
					/>
					<Button
						variant="contained"
						color="primary"
						onClick={handleFetchDataForYear}>
						Fetch Data by Year
					</Button>
				</div>
				<div style={{ marginBottom: "20px" }}>
					<FormControl style={{ marginRight: "10px", minWidth: 120 }}>
						<InputLabel>Start Month</InputLabel>
						<Select
							value={startMonth}
							onChange={handleStartMonthChange}
							label="Start Month">
							{[
								"01",
								"02",
								"03",
								"04",
								"05",
								"06",
								"07",
								"08",
								"09",
								"10",
								"11",
								"12",
							].map((month) => (
								<MenuItem
									key={month}
									value={month}>
									{month}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="Start Year (YYYY)"
						type="number"
						value={startYear}
						onChange={handleStartYearChange}
						style={{ marginRight: "10px" }}
					/>
					<FormControl style={{ marginRight: "10px", minWidth: 120 }}>
						<InputLabel>End Month</InputLabel>
						<Select
							value={endMonth}
							onChange={handleEndMonthChange}
							label="End Month">
							{[
								"01",
								"02",
								"03",
								"04",
								"05",
								"06",
								"07",
								"08",
								"09",
								"10",
								"11",
								"12",
							].map((month) => (
								<MenuItem
									key={month}
									value={month}>
									{month}
								</MenuItem>
							))}
						</Select>
					</FormControl>
					<TextField
						label="End Year (YYYY)"
						type="number"
						value={endYear}
						onChange={handleEndYearChange}
					/>
					<Button
						variant="contained"
						color="secondary"
						onClick={fetchDataByDateRange}>
						Fetch Data by Date Range
					</Button>
				</div>
				<div>
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
						onClick={handlePreviousPage}
						disabled={page === 0}>
						Previous Page
					</button>
					<button onClick={handleNextPage}>Go to the Next Page</button>
				</div>
			</Paper>
		</div>
	);
}

export default CatchRecords;
