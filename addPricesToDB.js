const mongoose = require('mongoose');

// Connect to db
let dbName = 'db_zenCinema'
mongoose.connect(`mongodb://localhost/${dbName}`);
global.db = mongoose.connection;
db.on('error', () => console.log('Could not connect to DB'));
db.once('open', () => {
  console.log('Connected to DB');
  addPricesToDb();
});

let TicketPrice = require('./models/TicketPrice');

async function addPricesToDb() {
  let priceCount = await TicketPrice.count();

  if (priceCount > 0) {
    console.log('Deleted prices', await TicketPrice.remove({}));
  }


  let kid = {
    name: 'Barn',
    price: '65'
  };
  let normal = {
    name: 'Ordinarie',
    price: '85'
  };
  let senior = {
    name: 'Pensionärer',
    price: '75'
  };

  let prices = [kid, normal, senior];

  for (let i = 0; i < prices.length; i++) {
    let price = new TicketPrice({
      name: prices[i].name,
      price: prices[i].price
    });
    await price.save();
  }

  priceCount = await TicketPrice.count();


  console.log(`Added ${priceCount} prices to the database`);

  process.exit();

}
