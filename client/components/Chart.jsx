import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { render } from 'react-dom';
import { Chart as GoogleChart } from 'react-google-charts';

export default function Chart(props) {
	const { stocks } = props;
	const stockNames = Object.keys(stocks);
	const stocksLength = stockNames.length;
	if (stockNames.length > 0) {
		const options = {
			title: 'Stock Price Historical TrendLines',
			legend: { position: 'bottom' }
		};
		const stockData = stockNames.map(stock => stocks[stock].data);
		const columns = [ { type: 'date',	label: 'Month' }, ...stockNames
			.map(stock => ({ type: 'number', label: stock }))];
    const rows = [...stocks[stockNames[0]].data.map((stock, index) => ([
			new Date(stock[0]), ...stockData.map(data => data[index] ? data[index][1] : 0)
		]))];
		return <GoogleChart
			chartType="LineChart"
			options={options}
			rows={rows}
			columns={columns}
			graph_id="LineChart"
			width="100%"
			height="70vh"
			legend_toggle
		/>
	}

	return null
}

Chart.propTypes = {
	stocks: PropTypes.object.isRequired
}
