import axios from 'axios';
import Logger from 'js-logger';
import { Stock } from '../models';
import { isDevMode } from '../server';
import { catchBlock } from '../middlewares';

const { API_KEY } = process.env;

export async function getStockData(name, startDate, endDate, show) {
  try {
		const validArgs = (
			/[A-Za-z0-9]*/gi.test(name) &&
			typeof show === 'boolean' &&
			[endDate, startDate].every(date => /^\d{4}(-\d{2}){2}$/.test(date))
		);
		if (!validArgs) {
			throw new TypeError('invalid arguments supplied to getStockData');
		}

		const { data: { dataset: { data } } } = await axios({
			url: `https://www.quandl.com/api/v3/datasets/WIKI/${name}.json`,
			params: {
				start_date: startDate,
				end_date: endDate,
				api_key: API_KEY
			}
		});

		await createStockSetting(name, show);

		return { name, data };
	} catch (error) {
		throw new Error(error.response.data.quandl_error.message)
	}
}

export async function getDefaultStockData(stocks, getStocks, time) {
  return catchBlock(isDevMode, async () => {
		const data = await Promise.all(
			stocks.map(stock => getStocks(stock, time.startDate, time.endDate, true))
		);
		const settings = stocks.map(stock => ({ name: stock, show: true }));

		return { data, settings };
	});
}

export async function createStockSetting(name, show) {
  return catchBlock(isDevMode, async () => {
		const validArgs = /[A-Za-z0-9]*/gi.test(name) && typeof show === 'boolean';
		if (!validArgs) {
			throw new TypeError('invalid arguments supplied to createStockSettings');
		}
		const setting = await Stock.findOrCreate({ name }, { name, show });

		return setting;
	});
}

export async function getStockSetting(name) {
  return catchBlock(isDevMode, async () => {
		if (/[A-Za-z0-9]*/gi.test(name)) {
			throw new TypeError('invalid stock name, supply string')
		}

		return await Stock.findOne({ name });
	});
}

export async function getStockSettings(names) {
  return catchBlock(isDevMode, async () => {
		if (names.every(name => /[A-Za-z0-9]*/gi.test(name))) {
			throw new TypeError('invalid stock name, supply string values in array')
		}

		return await Stock.find({ name: { $in: names } });
	});
}

export async function updateStockSetting(stock, show) {
	return catchBlock(isDevMode, async () => {
		const validArgs = /[A-Za-z0-9]*/gi.test(name) && typeof show === 'boolean';
		if (!validArgs) {
			throw new TypeError('invalid arguments supplied to createStockSettings');
		}

		return await Stock.findOneAndUpdate({ name }, { show });
	});
}

export async function deleteStockSetting(name) {
	 await Stock.findOneAndRemove({ name });

	 return `stock ${name} deleted`;
}
