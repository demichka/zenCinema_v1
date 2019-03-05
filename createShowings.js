const mongoose = require('mongoose');

// Connect to db
let dbName = 'db_zenCinema'
mongoose.connect(`mongodb://localhost/${dbName}`);
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
  console.log('Connected to DB');
  createAndAddShowingsTo();
});

let Saloon = require('./models/Saloon');
let Film = require('./models/Film');
let Showing = require('./models/Showing');

function randomItem(arr) {
  return arr[Math.floor(Math.random() * arr.length)];
}

function shuffleArr(array){
  for (let i = array.length - 1; i > 0; i--) {
    let j = Math.floor(Math.random() * (i + 1));
    let temp = array[i];
    array[i] = array[j];
    array[j] = temp;
  }
  return array;
}
async function createAndAddShowingsTo() {
  let showingsCount = await Showing.count();

  if (showingsCount > 0) {
    console.log('Deleted showings: ', await Showing.remove({}));
  }

  let date = new Date();

  let movies = await Film.find();
  let saloons = await Saloon.find();
  let times = ['17:00', '19:30', '22:00'];
  for (let i = 0; i < 84; i++) {
    if (i % 3 == 0) {
      date = new Date(date.setDate(date.getDate() + 1));
      date.setHours(00);
      date.setMinutes(00);
      date.setSeconds(00);
    }

    let showtime = new Showing({
      "date": date.getTime(),
    });
    await showtime.save();

  }

  let showings = await Showing.find();
  for (let i = 0; i < showings.length; i++) {
    let showing = showings[i];
    let moviesShuffle = shuffleArr(movies);
    let film = randomItem(moviesShuffle);
    showing.film = film;
    let saloon;
    let time;
    if (i % 2 === 0) {
      saloon = saloons[0];
      time = times[1];
      showing.saloon = saloon;
      showing.time = time;
      moviesShuffle = shuffleArr(movies);

      film = randomItem(moviesShuffle);
      showing.film = film;
    }


    else {
    saloon = saloons[2];
    time = times[0];
    showing.saloon = saloon;
    showing.time = time;
    moviesShuffle = shuffleArr(movies);

    film = randomItem(moviesShuffle);
    showing.film = film;
    }
    await showing.save();  
  }

  showings = await Showing.find();
  for (let i = 0; i < showings.length; i+=3) {
    let showing = showings[i];

    let saloon = saloons[1];
    let time = times[2];
    showing.saloon = saloon;
    showing.time = time;
    let film = randomItem(movies);
    showing.film = film;

    await showing.save();
  }


  showingsCount = await Showing.count();


  console.log(`Added ${showingsCount} showings to the database`);

  process.exit();

}
