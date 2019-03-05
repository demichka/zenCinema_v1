const mongoose = require('mongoose');

// Connect to db
let dbName = 'db_zenCinema'
mongoose.connect(`mongodb://localhost/${dbName}`);
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
  console.log('Connected to DB');
  addSaloonsToDb();
});

let Saloon = require('./models/Saloon');

async function addSaloonsToDb() {
  let saloonsCount = await Saloon.count();

  if (saloonsCount > 0) {
    console.log('Deleted saloons', await Saloon.remove({}));
  }


  let schemaOne = {
    name: 'Zenmongouse',
    schema: [8, 9, 10, 10, 10, 10, 12, 12]
  };
  let schemaTwo = {
    name: 'Zentermidiate',
    schema: [6, 8, 9, 10, 10, 12]
  };
  let schemaThree = {
    name: 'Zenpetit',
    schema: [5, 7, 9, 9, 12]
  };

  schemas = [schemaOne, schemaTwo, schemaThree];

  for (let i = 0; i < schemas.length; i++) {
    let saloon = new Saloon({
      name: schemas[i].name,
      seatsPerRow: schemas[i].schema,
      showings: []
    });
    await saloon.save();
  }

  saloonsCount = await Saloon.count();


  console.log(`Added ${saloonsCount} saloons to the database`);

  process.exit();

}
