const fs = require("fs");
const csv = require("csv-parser");
const mongoose = require("mongoose");
const path = require("path");
const CatchRecord = require("./src/models/catchRecordModel");
const Vessel = require("./src/models/vesselModel");

mongoose.connect("mongodb://localhost:27017/bycatchDatabase", {
	useNewUrlParser: true,
	useUnifiedTopology: true,
});

const years = [
	2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022, 2023,
];

years.forEach((year) => {
	const results = [];
	const csvFilePath = path.join(
		__dirname,
		"byCatchData",
		`car270_psc_rates${year}.csv`
	);

	fs.createReadStream(csvFilePath)
		.pipe(csv())
		.on("data", (data) => results.push(data))
		.on("end", async () => {
			for (const row of results) {
				try {
					const vessel = await Vessel.findOneAndUpdate(
						{ vesselID: row["VESSEL ID"] },
						{ name: row["NAME"] },
						{ upsert: true, new: true }
					);

					const catchRecord = new CatchRecord({
						weekEndDate: row["WEEK END DATE"], // Keep as string
						vessel: vessel._id,
						area: row["AREA"],
						gear: row["GEAR"],
						target: row["TARGET"],
						halibut: parseFloat(row["HALIBUT"]) || 0,
						herring: parseFloat(row["HERRING"]) || 0,
						redKingCrab: parseFloat(row["RED KING CRAB"]) || 0,
						otherKingCrab: parseFloat(row["OTHER KING CRAB"]) || 0,
						bairdiTanner: parseFloat(row["BAIRDI TANNER"]) || 0,
						otherTanner: parseFloat(row["OTHER TANNER"]) || 0,
						chinook: parseInt(row["CHINOOK"], 10) || 0,
						nonChinook: parseInt(row["NON-CHINOOK"], 10) || 0,
						sampledHauls: parseInt(row["SAMPLED HAULS"], 10) || 0,
					});

					await catchRecord.save();
				} catch (error) {
					console.error("Error saving the record:", error);
				}
			}

			console.log(`CSV file for year ${year} successfully processed`);
		});
});
