const mongoose = require('mongoose');

// Connect to db
let dbName = 'db_zenCinema'
mongoose.connect(`mongodb://localhost/${dbName}`);
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
  console.log('Connected to DB');
  importJsonDataToDb();
});

// Load Mongoose models
let Film = require('./models/Film');

// Load the json data from file
let filmData = require('./films.json');

async function importJsonDataToDb(){
  let allFilmsCount = await Film.count();  
  // if the db already contains films then delete them
  if(allFilmsCount > 0){
    console.log('Deleted old films', await Film.remove({}));
  }
  
  // creates films
  for(let data of filmData){
    let film = new Film(data);
    await film.save();
  }
  // after the import count the films again
  allFilmsCount = await Film.count();
  console.log(`Imported ${allFilmsCount} films to the database`);
  // Exit the app
  process.exit();
}