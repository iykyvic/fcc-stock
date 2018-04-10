'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.deleteStockSetting = exports.updateStockSetting = exports.getStockSettings = exports.getStockSetting = exports.createStockSetting = exports.getDefaultStockData = exports.getStockData = undefined;

var _regenerator = require('babel-runtime/regenerator');

var _regenerator2 = _interopRequireDefault(_regenerator);

var getStockData = exports.getStockData = function () {
	var _ref = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee(name, startDate, endDate, show) {
		var validArgs, _ref2, data;

		return _regenerator2.default.wrap(function _callee$(_context) {
			while (1) {
				switch (_context.prev = _context.next) {
					case 0:
						_context.prev = 0;
						validArgs = /[A-Za-z0-9]*/gi.test(name) && typeof show === 'boolean' && [endDate, startDate].every(function (date) {
							return (/^\d{4}(-\d{2}){2}$/.test(date)
							);
						});

						if (validArgs) {
							_context.next = 4;
							break;
						}

						throw new TypeError('invalid arguments supplied to getStockData');

					case 4:
						_context.next = 6;
						return (0, _axios2.default)({
							url: 'https://www.quandl.com/api/v3/datasets/WIKI/' + name + '.json',
							params: {
								start_date: startDate,
								end_date: endDate,
								api_key: API_KEY
							}
						});

					case 6:
						_ref2 = _context.sent;
						data = _ref2.data.dataset.data;
						_context.next = 10;
						return createStockSetting(name, show);

					case 10:
						return _context.abrupt('return', { name: name, data: data });

					case 13:
						_context.prev = 13;
						_context.t0 = _context['catch'](0);
						throw new Error(_context.t0.response.data.quandl_error.message);

					case 16:
					case 'end':
						return _context.stop();
				}
			}
		}, _callee, this, [[0, 13]]);
	}));

	return function getStockData(_x, _x2, _x3, _x4) {
		return _ref.apply(this, arguments);
	};
}();

var getDefaultStockData = exports.getDefaultStockData = function () {
	var _ref3 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee3(stocks, getStocks, time) {
		var _this = this;

		return _regenerator2.default.wrap(function _callee3$(_context3) {
			while (1) {
				switch (_context3.prev = _context3.next) {
					case 0:
						return _context3.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee2() {
							var data, settings;
							return _regenerator2.default.wrap(function _callee2$(_context2) {
								while (1) {
									switch (_context2.prev = _context2.next) {
										case 0:
											_context2.next = 2;
											return Promise.all(stocks.map(function (stock) {
												return getStocks(stock, time.startDate, time.endDate, true);
											}));

										case 2:
											data = _context2.sent;
											settings = stocks.map(function (stock) {
												return { name: stock, show: true };
											});
											return _context2.abrupt('return', { data: data, settings: settings });

										case 5:
										case 'end':
											return _context2.stop();
									}
								}
							}, _callee2, _this);
						}))));

					case 1:
					case 'end':
						return _context3.stop();
				}
			}
		}, _callee3, this);
	}));

	return function getDefaultStockData(_x5, _x6, _x7) {
		return _ref3.apply(this, arguments);
	};
}();

var createStockSetting = exports.createStockSetting = function () {
	var _ref5 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee5(name, show) {
		var _this2 = this;

		return _regenerator2.default.wrap(function _callee5$(_context5) {
			while (1) {
				switch (_context5.prev = _context5.next) {
					case 0:
						return _context5.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee4() {
							var validArgs, setting;
							return _regenerator2.default.wrap(function _callee4$(_context4) {
								while (1) {
									switch (_context4.prev = _context4.next) {
										case 0:
											validArgs = /[A-Za-z0-9]*/gi.test(name) && typeof show === 'boolean';

											if (validArgs) {
												_context4.next = 3;
												break;
											}

											throw new TypeError('invalid arguments supplied to createStockSettings');

										case 3:
											_context4.next = 5;
											return _models.Stock.findOrCreate({ name: name }, { name: name, show: show });

										case 5:
											setting = _context4.sent;
											return _context4.abrupt('return', setting);

										case 7:
										case 'end':
											return _context4.stop();
									}
								}
							}, _callee4, _this2);
						}))));

					case 1:
					case 'end':
						return _context5.stop();
				}
			}
		}, _callee5, this);
	}));

	return function createStockSetting(_x8, _x9) {
		return _ref5.apply(this, arguments);
	};
}();

var getStockSetting = exports.getStockSetting = function () {
	var _ref7 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee7(name) {
		var _this3 = this;

		return _regenerator2.default.wrap(function _callee7$(_context7) {
			while (1) {
				switch (_context7.prev = _context7.next) {
					case 0:
						return _context7.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee6() {
							return _regenerator2.default.wrap(function _callee6$(_context6) {
								while (1) {
									switch (_context6.prev = _context6.next) {
										case 0:
											if (!/[A-Za-z0-9]*/gi.test(name)) {
												_context6.next = 2;
												break;
											}

											throw new TypeError('invalid stock name, supply string');

										case 2:
											_context6.next = 4;
											return _models.Stock.findOne({ name: name });

										case 4:
											return _context6.abrupt('return', _context6.sent);

										case 5:
										case 'end':
											return _context6.stop();
									}
								}
							}, _callee6, _this3);
						}))));

					case 1:
					case 'end':
						return _context7.stop();
				}
			}
		}, _callee7, this);
	}));

	return function getStockSetting(_x10) {
		return _ref7.apply(this, arguments);
	};
}();

var getStockSettings = exports.getStockSettings = function () {
	var _ref9 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee9(names) {
		var _this4 = this;

		return _regenerator2.default.wrap(function _callee9$(_context9) {
			while (1) {
				switch (_context9.prev = _context9.next) {
					case 0:
						return _context9.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee8() {
							return _regenerator2.default.wrap(function _callee8$(_context8) {
								while (1) {
									switch (_context8.prev = _context8.next) {
										case 0:
											if (!names.every(function (name) {
												return (/[A-Za-z0-9]*/gi.test(name)
												);
											})) {
												_context8.next = 2;
												break;
											}

											throw new TypeError('invalid stock name, supply string values in array');

										case 2:
											_context8.next = 4;
											return _models.Stock.find({ name: { $in: names } });

										case 4:
											return _context8.abrupt('return', _context8.sent);

										case 5:
										case 'end':
											return _context8.stop();
									}
								}
							}, _callee8, _this4);
						}))));

					case 1:
					case 'end':
						return _context9.stop();
				}
			}
		}, _callee9, this);
	}));

	return function getStockSettings(_x11) {
		return _ref9.apply(this, arguments);
	};
}();

var updateStockSetting = exports.updateStockSetting = function () {
	var _ref11 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee11(stock, show) {
		var _this5 = this;

		return _regenerator2.default.wrap(function _callee11$(_context11) {
			while (1) {
				switch (_context11.prev = _context11.next) {
					case 0:
						return _context11.abrupt('return', (0, _middlewares.catchBlock)(_server.isDevMode, _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee10() {
							var validArgs;
							return _regenerator2.default.wrap(function _callee10$(_context10) {
								while (1) {
									switch (_context10.prev = _context10.next) {
										case 0:
											validArgs = /[A-Za-z0-9]*/gi.test(name) && typeof show === 'boolean';

											if (validArgs) {
												_context10.next = 3;
												break;
											}

											throw new TypeError('invalid arguments supplied to createStockSettings');

										case 3:
											_context10.next = 5;
											return _models.Stock.findOneAndUpdate({ name: name }, { show: show });

										case 5:
											return _context10.abrupt('return', _context10.sent);

										case 6:
										case 'end':
											return _context10.stop();
									}
								}
							}, _callee10, _this5);
						}))));

					case 1:
					case 'end':
						return _context11.stop();
				}
			}
		}, _callee11, this);
	}));

	return function updateStockSetting(_x12, _x13) {
		return _ref11.apply(this, arguments);
	};
}();

var deleteStockSetting = exports.deleteStockSetting = function () {
	var _ref13 = _asyncToGenerator( /*#__PURE__*/_regenerator2.default.mark(function _callee12(name) {
		return _regenerator2.default.wrap(function _callee12$(_context12) {
			while (1) {
				switch (_context12.prev = _context12.next) {
					case 0:
						_context12.next = 2;
						return _models.Stock.findOneAndRemove({ name: name });

					case 2:
						return _context12.abrupt('return', 'stock ' + name + ' deleted');

					case 3:
					case 'end':
						return _context12.stop();
				}
			}
		}, _callee12, this);
	}));

	return function deleteStockSetting(_x14) {
		return _ref13.apply(this, arguments);
	};
}();

var _axios = require('axios');

var _axios2 = _interopRequireDefault(_axios);

var _jsLogger = require('js-logger');

var _jsLogger2 = _interopRequireDefault(_jsLogger);

var _models = require('../models');

var _server = require('../server');

var _middlewares = require('../middlewares');

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _asyncToGenerator(fn) { return function () { var gen = fn.apply(this, arguments); return new Promise(function (resolve, reject) { function step(key, arg) { try { var info = gen[key](arg); var value = info.value; } catch (error) { reject(error); return; } if (info.done) { resolve(value); } else { return Promise.resolve(value).then(function (value) { step("next", value); }, function (err) { step("throw", err); }); } } return step("next"); }); }; }

var API_KEY = process.env.API_KEY;