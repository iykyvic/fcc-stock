import mongoose from 'mongoose';
import findOrCreate from './find-or-create.plugin';

const Schema = mongoose.Schema;
const stockSchema = new Schema({
  name: { type: String, required: true },
  show: { type: Boolean, required: true }
});

stockSchema.plugin(findOrCreate, { appendToArray: true });
const Stock = mongoose.model('Stock', stockSchema);

export default Stock;
