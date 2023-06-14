const mongoose = require('mongoose');

const itemSchema = new mongoose.Schema({
  id: Number,
  name: String,
  description: String,
  link: String
});

const Item = mongoose.model('Item', itemSchema);

module.exports = Item;