import io from 'socket.io';
import { Stock } from '../models';
import { getStockData, deleteStockSetting } from '../controllers/stock.controller';
import { formattedYearIntervalFromNow, formatDate } from './index';
import { defaultStocks, isDevMode } from '../server';

const getStockDataNames = (stocks) => {
	return stocks.settings.map(setting => setting.name);
};

const socketIo = (app, time, stocks) => {
	const host = process.env.HOST_NAME.replace(/:\d+/, '');
	const port = isDevMode ? `:${process.env.PORT}` : '*';
  const sio = io(app, {
		origins: `${host}${port}`,
		wsEngine: 'ws',
    transports: ['websocket', 'polling']
	});

  // middleware
  sio.on('connection', (socket) => {
		socket.emit('stocks', stocks);

		socket.on('update', async (data) => {
			try {
				sio.emit('loading', { settings: true });
				const { settings } = stocks;
				const { name, show, index } = data;
				const validData = !settings.every(setting => setting.name !== name);

				if (!validData) {
					throw new TypeError('invalid stocks supplied');
				}
				const updatedStock =  await Stock.findOneAndUpdate({ name }, { show });

				stocks.settings[index].show = show;
				sio.emit('stocks', stocks);
				socket.emit('serverMessage', 'stock visibility successfully updated');
			} catch (error) {
				socket.emit('serverMessage', error.message);
			} finally {
				sio.emit('loading', { settings: false });
			}
		});

		socket.on('add', async (stock) => {
			try {
				stock = stock.toUpperCase();
				sio.emit('loadingForm', { loadingForm: true });
				sio.emit('loadingSettings', { loadingSettings: true });
				if (getStockDataNames(stocks).includes(stock)) {
					throw new Error('has been added, if disabled, you can enable it.');
				}
				const {
					startDate, endDate
				} = formattedYearIntervalFromNow(new Date(), formatDate);
				const { data } = await getStockData(stock, startDate, endDate, true);
				stocks.data.push({ name: stock, data });
				stocks.settings.push({ name: stock, show: true });

				sio.emit('stocks', stocks);
				socket.emit('serverMessage', 'stock successfully added');
			} catch (error) {
				socket.emit('serverMessage', error.message);
			} finally {
				sio.emit('loadingForm', { loadingForm: false });
				sio.emit('loadingSettings', { loadingSettings: false });
			}
		});

		socket.on('delete', async (stock) => {
			try {
				const stockNames = getStockDataNames(stocks);
				if (!stockNames.includes(stock)) {
					throw new Error('this stock is not present or valid');
				} else if(defaultStocks.includes(stock)) {
					throw new Error('delete disabled for default stocks');
				}
				const { data } = await deleteStockSetting(stock);

				delete stocks.data[stockNames.indexOf(stock)];
				delete stocks.settings[stockNames.indexOf(stock)];
				stocks.settings = stocks.settings.filter(stockName => stockName !== null);
				stocks.data = stocks.data.filter(stockName => stockName !== null)
				sio.emit('stocks', stocks);
				socket.emit('serverMessage', 'stock successfully deleted');
			} catch (error) {
				socket.emit('serverMessage', error.message);
			} finally {
				sio.emit('loading', { settings: false });
			}
		});
	});
};

export default socketIo;
