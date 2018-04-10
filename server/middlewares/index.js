import devMiddleware from './dev.middleware';
import socket        from './socket.middleware';

const isDevMode = process.NODE_ENV === 'development';

export function catchBlock(env, callback) {
	try {
		return callback();
	} catch (error) {
		if (env === 'development') {
			throw error
		}

		throw new Error(error.message);
	}
}

export function formatDate(timestamp) {
  return catchBlock(isDevMode, () => {
		if (typeof timestamp.getUTCDate !== 'function') {
			throw new TypeError('invalid timestamp supplied');
		}
		const date = new Date(timestamp);
		let month = date.getUTCMonth() + 1;
		month = /\d{2}/.test(month) ? month : `0${month}`
		let day = date.getUTCDate();
		day = /\d{2}/.test(day) ? day : `0${day}`;
		const year = date.getUTCFullYear();

		return `${year}-${month}-${day}`;
	});
}

export function formattedYearIntervalFromNow(now, formatDateFunc) {
  return catchBlock(isDevMode, () => {
		if (typeof now.getFullYear !== 'function' && typeof formatDateFunc !== 'function') {
			throw new TypeError('invalid argumennts supplied');
		}
		const endDate = formatDateFunc(now);
		const yearAgo = now.setFullYear(now.getFullYear() - 1);
		const startDate = formatDateFunc(now);

		return { startDate, endDate };
	});
}


module.exports.socket = socket;
module.exports.devMiddleware = devMiddleware;
