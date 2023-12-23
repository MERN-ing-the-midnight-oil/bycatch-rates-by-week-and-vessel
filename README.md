# NOAA fisheries BSAI/GOA Bycatch Rates Widget

## A demonstration project by Rhys Smoker (Certified full-stack web developer). Contact: merning.the.midnight.oil@gmail.com

## Overview

A full stack MERN web application that uses both RESTful methods and GraphQL for data handling. The application is divided into three main features:

1. **View All Catch Records By Year or Date Range**
2. **Catch Records by Vessel Name and Season**
3. **Charting Catch Records by Vessel Name and Season**

## Features

All data in my back end was found on [this NOAA website](https://www.fisheries.noaa.gov/alaska/commercial-fishing/fisheries-catch-and-landings-reports-alaska#bsai-prohibited-species).

### 1. View All Catch Records By Year or Date Range

Allows users to filter catch records by specific years or date ranges. It uses **RESTful API calls** to fetch and display data. Uses **tanstack/reacttable**. _Uses RESTful_ API calls.

### 2. Catch Records by Vessel Name and Season

This feature enables users to view catch records for specific vessels within chosen month ranges from many years. It uses **GraphQL API** calls to query and present the data.

### 3. Charting Catch Records by Vessel Name and Season

This component leverages Apollo Client for efficient **GraphQL** data fetching, Material-UI for a responsive and intuitive user interface, and **Recharts** for the chart rendering.

#### Functionality and Features

- **Dynamic Data Fetching**: Using GraphQL queries, the component fetches catch records based on user input. It specifically retrieves data for a chosen vessel across a user-selected month range spanning multiple years, offering a broad view of catch trends over time.
- **Custom Data Transformation**: The transformDataForCharts function processes the fetched data, ensuring it is compatible with the Recharts library. This critical step takes the raw collection of catch records and transforms it into an array of species-specific records. Each species record contains year-specific datasets, which in turn comprise of MM/DD formatted dates and corresponding catch amounts. This modified structuring enables the chart to display year-over-year comparisons of bycatch for the selected time frame.

- **Interactive Chart Visualization and User Interface**: The Recharts library is used. Each chart is dedicated to a specific species, with individual lines depicting catch records across different years. This representation allows for easy comparison of catch trends. Material-UI components such as sliders and dropdown menus make for a user-friendly front end.

#### Technical Highlights

- **React Patterns**: The component uses React hooks such as useState, useEffect, and useLazyQuery from Apollo Client.
- **State Management and Propagation**: It manages state to synchronize user input with data fetching and chart rendering.

### Backend

The backend is implemented using Node.js and GraphQL. It handles data storage and retrieval, offering the following functionalities:

- **GraphQL Schema**: Defines the structure of the data and the queries/mutations available.
- **Resolvers**: Implements the logic for responding to GraphQL queries, interacting with the MongoDB database.
- **Database Models**: Utilizes Mongoose models to represent and interact with data in MongoDB.

### GraphQL API

The application's data handling is powered by GraphQL, providing efficient and flexible data retrieval. Key points include:

- **Queries**: GraphQL queries are used to fetch data based on specific requirements, like vessel names, date ranges, etc.
