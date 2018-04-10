'use strict';

Object.defineProperty(exports, "__esModule", {
	value: true
});
exports.catchBlock = catchBlock;
exports.formatDate = formatDate;
exports.formattedYearIntervalFromNow = formattedYearIntervalFromNow;

var _dev = require('./dev.middleware');

var _dev2 = _interopRequireDefault(_dev);

var _socket = require('./socket.middleware');

var _socket2 = _interopRequireDefault(_socket);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var isDevMode = process.NODE_ENV === 'development';

function catchBlock(env, callback) {
	try {
		return callback();
	} catch (error) {
		if (env === 'development') {
			throw error;
		}

		throw new Error(error.message);
	}
}

function formatDate(timestamp) {
	return catchBlock(isDevMode, function () {
		if (typeof timestamp.getUTCDate !== 'function') {
			throw new TypeError('invalid timestamp supplied');
		}
		var date = new Date(timestamp);
		var month = date.getUTCMonth() + 1;
		month = /\d{2}/.test(month) ? month : '0' + month;
		var day = date.getUTCDate();
		day = /\d{2}/.test(day) ? day : '0' + day;
		var year = date.getUTCFullYear();

		return year + '-' + month + '-' + day;
	});
}

function formattedYearIntervalFromNow(now, formatDateFunc) {
	return catchBlock(isDevMode, function () {
		if (typeof now.getFullYear !== 'function' && typeof formatDateFunc !== 'function') {
			throw new TypeError('invalid argumennts supplied');
		}
		var endDate = formatDateFunc(now);
		var yearAgo = now.setFullYear(now.getFullYear() - 1);
		var startDate = formatDateFunc(now);

		return { startDate: startDate, endDate: endDate };
	});
}

module.exports.socket = _socket2.default;
module.exports.devMiddleware = _dev2.default;