'use strict';

Object.defineProperty(exports, "__esModule", {
  value: true
});

var _mongoose = require('mongoose');

var _mongoose2 = _interopRequireDefault(_mongoose);

var _findOrCreate = require('./find-or-create.plugin');

var _findOrCreate2 = _interopRequireDefault(_findOrCreate);

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

var Schema = _mongoose2.default.Schema;
var stockSchema = new Schema({
  name: { type: String, required: true },
  show: { type: Boolean, required: true }
});

stockSchema.plugin(_findOrCreate2.default, { appendToArray: true });
var Stock = _mongoose2.default.model('Stock', stockSchema);

exports.default = Stock;