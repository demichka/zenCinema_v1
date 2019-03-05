const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let saloonSchema = new Schema ({
    "name": {type: String, required: true},
    "seatsPerRow": [],
    "bestRows": []
});

module.exports = db.model('Saloon', saloonSchema);