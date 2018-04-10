import { config }        from 'dotenv';
import debug             from 'debug';
import path              from 'path';
import express           from 'express';
import favicon           from 'serve-favicon';
import logger            from 'morgan';
import Logger            from 'js-logger';
import bodyParser        from 'body-parser';
import http              from 'http';
import { database }      from './models';
import { devMiddleware, socket } from './middlewares';
import { formattedYearIntervalFromNow, formatDate } from './middlewares';
import { getStockData, getDefaultStockData } from './controllers/stock.controller';

config();
debug('fccstocks:app');
Logger.useDefaults();

const app = express();
const { env: { NODE_ENV, PORT, STOCKS } } = process;
export const defaultStocks = STOCKS ? STOCKS.split(',') : ['CSCO'];
const time = formattedYearIntervalFromNow(new Date(), formatDate);

export const isDevMode = NODE_ENV === 'development';

/**
 * Normalize a port into a number, string, or false.
 * @param {Number} val a string or number port
 * @returns {Number} a number representing the port
 */
const normalizePort = (val) => {
  const portNumber = parseInt(val, 10);
  if (isNaN(portNumber)) {
    return val;
  }

  if (portNumber >= 0) {
    return portNumber;
  }
  return false;
};

const port = normalizePort(PORT || '3000');

app.server = http.createServer(app);

/**
 * Event listener for HTTP server "error" event.
 * @param {any} error an error message
 * @returns {null} error already thrown
 */
const onError = (error) => {
  if (error.syscall !== 'listen') {
    throw error;
  }
  const bind = typeof port === 'string'
    ? `Pipe ${port}`
    : `Port ${port}`;
  switch (error.code) {
    case 'EACCES':
      Logger.error(`${bind} requires elevated privileges`);
      process.exit(1);
      break;
    case 'EADDRINUSE':
      Logger.error(`${bind} is already in use`);
      process.exit(1);
      break;
    default:
			throw error;
  }
};

/**
 * Event listener for HTTP server "listening" event.
 * @returns {null} server process is continous here, so no returns
 */
const onListening = (stocks) => {
  const addr = app.server.address();
  const bind = typeof addr === 'string'
    ? `pipe ${addr}`
		: `port ${addr.port}`;

	try {
		socket(app, app.server, time, stocks);
	} catch (error) {
		throw error;
	}

  return Logger.debug(`🚧 App is Listening on ${bind}`);
};
const headers1 = 'Origin, X-Requested-With, Content-Type, Accept';
const headers2 = ',Authorization, Access-Control-Allow-Credentials';

app.set('port', port);
app.set('json spaces', 2);
app.set('json replacer', (key, value) => {
  const excludes = ['password', '_raw', '_json', '__v'];
  return excludes.includes(key) ? undefined : value;
});

app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*');
  res.header('Access-Control-Allow-Methods', 'GET, POST, DELETE, PATCH');
  res.header('Access-Control-Allow-Headers', `${headers1} ${headers2}`);
  res.header('Access-Control-Allow-Credentials', 'true');
  next();
});
app.use('/public/assets', express.static(path.resolve(__dirname, 'public/assets')));
app.use(favicon(path.join(__dirname, '../favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json());
if (isDevMode) {
	devMiddleware(app)
} else {
	app.get('*.js', (req, res, next) => {
		req.url = `${req.url}.gz`;
		res.set('Content-Encoding', 'gzip');
		next();
	});

	app.use('*', (req, res) => res
  	.sendFile(path.resolve(__dirname, 'public/index.html')))
}

app.database = database;
app.database.on('error', () => Logger.info('connection error'));
app.database.once('open', async () => await getDefaultStockData(defaultStocks, getStockData, time)
  .then(stocks => app.server.listen(port)
		.on('listening', onListening.bind(null, stocks))
		.on('error', onError))
	.catch(error => {
		Logger.log(error.message);
		return process.exit(1);
	}));

export default app;
