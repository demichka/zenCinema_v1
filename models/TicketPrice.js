const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let priceSchema = new Schema({
    "name": {type: String, required: true},
    "price": String
});

module.exports = db.model('Price', priceSchema);