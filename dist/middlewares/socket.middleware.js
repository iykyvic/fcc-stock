'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var _socket = require('socket.io');

var _socket2 = _interopRequireDefault(_socket);

var _models = require('../models');

var _stock = require('../controllers/stock.controller');

var _index = require('./index');

var _server = require('../server');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var getStockDataNames = function getStockDataNames(stocks) {
	return stocks.settings.map(function (setting) {
		return setting.name;
	});
};

var socketIo = function socketIo(app, server, time, stocks) {
	var sio = (0, _socket2.default)(server, {
		origins: '' + process.env.HOST_NAME
	});

	// middleware
	sio.on('connection', function (socket) {
		socket.emit('stocks', stocks);

		socket.on('update', function () {
			var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(data) {
				var settings, name, show, index, validData, updatedStock;
				return _regenerator2.default.wrap(function _callee$(_context) {
					while (1) {
						switch (_context.prev = _context.next) {
							case 0:
								_context.prev = 0;

								sio.emit('loading', { settings: true });
								settings = stocks.settings;
								name = data.name, show = data.show, index = data.index;
								validData = !settings.every(function (setting) {
									return setting.name !== name;
								});

								if (validData) {
									_context.next = 7;
									break;
								}

								throw new TypeError('invalid stocks supplied');

							case 7:
								_context.next = 9;
								return _models.Stock.findOneAndUpdate({ name: name }, { show: show });

							case 9:
								updatedStock = _context.sent;


								stocks.settings[index].show = show;
								sio.emit('stocks', stocks);
								socket.emit('serverMessage', 'stock visibility successfully updated');
								_context.next = 18;
								break;

							case 15:
								_context.prev = 15;
								_context.t0 = _context['catch'](0);

								socket.emit('serverMessage', _context.t0.message);

							case 18:
								_context.prev = 18;

								sio.emit('loading', { settings: false });
								return _context.finish(18);

							case 21:
							case 'end':
								return _context.stop();
						}
					}
				}, _callee, undefined, [[0, 15, 18, 21]]);
			}));

			return function (_x) {
				return _ref.apply(this, arguments);
			};
		}());

		socket.on('add', function () {
			var _ref2 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2(stock) {
				var _formattedYearInterva, startDate, endDate, _ref3, data;

				return _regenerator2.default.wrap(function _callee2$(_context2) {
					while (1) {
						switch (_context2.prev = _context2.next) {
							case 0:
								_context2.prev = 0;

								stock = stock.toUpperCase();
								sio.emit('loadingForm', { loadingForm: true });
								sio.emit('loadingSettings', { loadingSettings: true });

								if (!getStockDataNames(stocks).includes(stock)) {
									_context2.next = 6;
									break;
								}

								throw new Error('has been added, if disabled, you can enable it.');

							case 6:
								_formattedYearInterva = (0, _index.formattedYearIntervalFromNow)(new Date(), _index.formatDate), startDate = _formattedYearInterva.startDate, endDate = _formattedYearInterva.endDate;
								_context2.next = 9;
								return (0, _stock.getStockData)(stock, startDate, endDate, true);

							case 9:
								_ref3 = _context2.sent;
								data = _ref3.data;

								stocks.data.push({ name: stock, data: data });
								stocks.settings.push({ name: stock, show: true });

								sio.emit('stocks', stocks);
								socket.emit('serverMessage', 'stock successfully added');
								_context2.next = 20;
								break;

							case 17:
								_context2.prev = 17;
								_context2.t0 = _context2['catch'](0);

								socket.emit('serverMessage', _context2.t0.message);

							case 20:
								_context2.prev = 20;

								sio.emit('loadingForm', { loadingForm: false });
								sio.emit('loadingSettings', { loadingSettings: false });
								return _context2.finish(20);

							case 24:
							case 'end':
								return _context2.stop();
						}
					}
				}, _callee2, undefined, [[0, 17, 20, 24]]);
			}));

			return function (_x2) {
				return _ref2.apply(this, arguments);
			};
		}());

		socket.on('delete', function () {
			var _ref4 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(stock) {
				var stockNames, _ref5, data;

				return _regenerator2.default.wrap(function _callee3$(_context3) {
					while (1) {
						switch (_context3.prev = _context3.next) {
							case 0:
								_context3.prev = 0;
								stockNames = getStockDataNames(stocks);

								if (stockNames.includes(stock)) {
									_context3.next = 6;
									break;
								}

								throw new Error('this stock is not present or valid');

							case 6:
								if (!_server.defaultStocks.includes(stock)) {
									_context3.next = 8;
									break;
								}

								throw new Error('delete disabled for default stocks');

							case 8:
								_context3.next = 10;
								return (0, _stock.deleteStockSetting)(stock);

							case 10:
								_ref5 = _context3.sent;
								data = _ref5.data;


								delete stocks.data[stockNames.indexOf(stock)];
								delete stocks.settings[stockNames.indexOf(stock)];
								stocks.settings = stocks.settings.filter(function (stockName) {
									return stockName !== null;
								});
								stocks.data = stocks.data.filter(function (stockName) {
									return stockName !== null;
								});
								sio.emit('stocks', stocks);
								socket.emit('serverMessage', 'stock successfully deleted');
								_context3.next = 23;
								break;

							case 20:
								_context3.prev = 20;
								_context3.t0 = _context3['catch'](0);

								socket.emit('serverMessage', _context3.t0.message);

							case 23:
								_context3.prev = 23;

								sio.emit('loading', { settings: false });
								return _context3.finish(23);

							case 26:
							case 'end':
								return _context3.stop();
						}
					}
				}, _callee3, undefined, [[0, 20, 23, 26]]);
			}));

			return function (_x3) {
				return _ref4.apply(this, arguments);
			};
		}());
	});
};

exports.default = socketIo;