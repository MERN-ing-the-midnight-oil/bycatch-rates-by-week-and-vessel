import React, { useEffect, useState } from "react";
import {
	createColumnHelper,
	flexRender,
	getCoreRowModel,
	useReactTable,
} from "@tanstack/react-table";

function CatchRecords() {
	const [data, setData] = useState([]);

	// Define columns inside the component to avoid ESLint issues
	const columnHelper = createColumnHelper();
	const columns = [
		columnHelper.accessor("weekEndDate", {
			header: "Week End Date",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("vessel", {
			header: "Vessel",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("area", {
			header: "Area",
			cell: (info) => info.getValue(),
		}),
		columnHelper.accessor("halibut", {
			header: "Halibut",
			cell: (info) => info.getValue(),
		}),
	];

	// Fetch data from the API
	useEffect(() => {
		console.log("Component mounted. Starting to fetch data.");

		const fetchData = async () => {
			try {
				console.log("Sending request to the API...");
				const response = await fetch("http://localhost:4000/api/catchrecords");
				const json = await response.json();
				console.log("Data received from API:", json.slice(0, 10));
				setData(json.slice(0, 10)); // Fetch only the first 10 records for now
			} catch (error) {
				console.error("Error fetching data:", error);
			}
		};

		fetchData();
	}, []);

	console.log("Rendering table with data:", data);

	const table = useReactTable({
		data,
		columns,
		getCoreRowModel: getCoreRowModel(),
	});

	return (
		<div>
			<table>
				<thead>
					{table.getHeaderGroups().map((headerGroup) => (
						<tr key={headerGroup.id}>
							{headerGroup.headers.map((header) => (
								<th key={header.id}>
									{flexRender(
										header.column.columnDef.header,
										header.getContext()
									)}
								</th>
							))}
						</tr>
					))}
				</thead>
				<tbody>
					{table.getRowModel().rows.map((row) => (
						<tr key={row.id}>
							{row.getVisibleCells().map((cell) => (
								<td key={cell.id}>
									{flexRender(cell.column.columnDef.cell, cell.getContext())}
								</td>
							))}
						</tr>
					))}
				</tbody>
			</table>
		</div>
	);
}

export default CatchRecords;
