# NOAA fisheries BSAI/GOA Bycatch Rates Widget

## Overview

A full stack MERN web application that uses GraphQL for efficient data handling and a responsive user interface. The application is divided into three main features:

1. **View All Catch Records By Year or Date Range**
2. **Catch Records by Vessel Name and Season**
3. **Charting Catch Records by Vessel Name and Season**

## Features

### 1. View All Catch Records By Year or Date Range

Allows users to view catch records over specific years or date ranges. It uses **RESTful API calls** to fetch and display data that was downloaded from a NOAA website.

### 2. Catch Records by Vessel Name and Season

This feature enables users to view catch records for specific vessels within chosen month ranges. It uses **GraphQL API** calls to query and present the data.

### 3. Charting Catch Records by Vessel Name and Season

#### Feature Overview

This component uses Apollo Client for GraphQL data fetching, Material-UI for the user interface, and Recharts for chart rendering.

#### Functionality and Features

- **Dynamic Data Fetching**: The component uses GraphQL queries to fetch data based on user input. It retrieves catch records for a specified vessel over a selected month range associated with all years.
- **Custom Data Transformation**: The `transformDataForCharts` function takes the raw data fetched with my query and formats it to make it palatable to the **recharts library**. This function takes the raw collection of catch records for a vessel and creates an array of species specific records that each contain an array of year specific records that each contain an array of MM/DD dates and catch amount. This allows the chart to display the desired side-by-side across year comparisons of bycatch for a requested time of year.
- **Interactive Chart Visualization and User Interface**: The component uses the Recharts library to render line charts. Each chart corresponds to a different species, with lines representing catch records over different years. It also uses Material-UI components for sliders and dropdown menus for user input.

#### Technical Highlights

- **React Patterns**: The component uses React hooks such as useState, useEffect, and useLazyQuery from Apollo Client.
- **State Management and Propagation**: It manages state to synchronize user input with data fetching and chart rendering.

### Frontend

The frontend is built with React, offering a dynamic and responsive user experience. Key aspects include:

- **State Management**: Utilizes React's useState and useEffect hooks for managing component states and side effects.
- **Data Fetching**: Uses Apollo Client to make GraphQL queries (`useQuery` and `useLazyQuery`) and handle data fetching.
- **UI Components**: Employs Material-UI components for styling and layout, ensuring a modern and user-friendly interface.

### Backend

The backend is implemented using Node.js and GraphQL. It handles data storage and retrieval, offering the following functionalities:

- **GraphQL Schema**: Defines the structure of the data and the queries/mutations available.
- **Resolvers**: Implements the logic for responding to GraphQL queries, interacting with the MongoDB database.
- **Database Models**: Utilizes Mongoose models to represent and interact with data in MongoDB.

### GraphQL API

The application's data handling is powered by GraphQL, providing efficient and flexible data retrieval. Key points include:

- **Queries**: GraphQL queries are used to fetch data based on specific requirements, like vessel names, date ranges, etc.
