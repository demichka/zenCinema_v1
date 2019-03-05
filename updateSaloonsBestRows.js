const mongoose = require('mongoose');

// Connect to db
let dbName = 'db_zenCinema'
mongoose.connect(`mongodb://localhost/${dbName}`);
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
  console.log('Connected to DB');
  updateSaloonsToDb();
});

let Saloon = require('./models/Saloon');

async function updateSaloonsToDb() {
  let saloonsCount = await Saloon.count();

  let saloons = await Saloon.find();

  for (let i = 0; i < saloons.length; i++) {
    let saloon = saloons[i];
    if (saloon.name === 'Zenmongouse') {
      saloon.bestRows = [4,5,6];
    }
    if (saloon.name === 'Zentermidiate') {
      saloon.bestRows = [4,5];
    }
    if (saloon.name === 'Zenpetit') {
      saloon.name = 'Zenpetite';
      saloon.bestRows = [3,4];
    }
    await saloon.save();
  }

  saloonsCount = await Saloon.count();


  console.log(`Updated ${saloonsCount} saloons to the database`);

  process.exit();

}
