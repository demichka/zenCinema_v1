const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let filmSchema = new Schema ({
    "title": {type: String, required: true},
    "productionCountries": [{type: String}],
    "productionYear": {type: Number, required:true},
    "length": Number,
    "genre": String,
    "distributor": String,
    "language": String,
    "subtitles": String,
    "directors": [{type: String, required: true}],
    "actors": [{type: String}],
    "description": String,
    "images": [{type: String}],
    "youtubeTrailers": [{type: String}],
    "reviews": [],
    "link": String
});

module.exports = db.model('Film', filmSchema);