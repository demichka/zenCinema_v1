const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const CreateRestRoutes = require('./CreateRestRoutes')
/****************Login*************/
const LoginHandler = require('./LoginHandler');
const settings = require('./settings.json');
const session = require('express-session');
const MongoStore = require('connect-mongo')(session);
// Require sass compiler
const Sass = require('./sass');
const config = require('./config.json');
const fs = require('fs');
const path = require('path');

global.passwordSalt = settings.passwordSalt;

const flexjson = require('jsonflex')({
  jsonDir: '/www/json', // directory on server to save json to
  scriptUrl: '/jsonflex.js', // url to load clientside script from
  saveUrl: '/json-save', // url used by jsonflex to save json
  loadUrlPrefix: '/json/' // prefix to add to clientside load url
});

module.exports = class Server {

  constructor() {
    this.start();
  }

  async start() {
    await this.connectToDb();
    await this.startWebServer();
  }

  connectToDb() {
    return new Promise((resolve, reject) => {
      let dbName = 'db_zenCinema'
      mongoose.connect(`mongodb://localhost/${dbName}`);
      global.db = mongoose.connection;
      db.on('error', () => reject('Could not connect to DB'));
      db.once('open', () => resolve('Connected to DB'));
    });
  }

  startWebServer() {

    // Create a web server
    const app = express();

    // Add body-parser to our requests
    app.use(bodyParser.json());

    // Add session (and cookie) handling to Express
    app.use(session({
      secret: settings.cookieSecret,
      resave: true,
      saveUninitialized: true,
      store: new MongoStore({
        mongooseConnection: db
      })
    }));

    // Set keys to names of rest routes
    const models = {
      films: require('./models/Film'),
      showings: require('./models/Showing'),
      users: require('./models/User'),
      bookings: require('./models/Booking'),
      saloons: require('./models/Saloon'),
      ticketprices: require('./models/TicketPrice')
    }
    //create all necessary rest routes for the models
    new CreateRestRoutes(app, db, models);
    //create special routes for login
    new LoginHandler(app, models.users);

    // Serve static files from www
    app.use(express.static('www'));

    // Automatically load all scripts at root level of js folder
    // and load their corresponding template files
    app.get('/autoload-js-and-templates', (req, res) => {
      let files = fs.readdirSync(path.join(__dirname, '/www/js/components'));
      files = files.filter(x => x.substr(-3) === '.js')
      let html = files.map(x => `<script src="/js/components/${x}"></script>`).join('');
      html += files.filter(x => fs.existsSync(path.join(
        __dirname, '/www/templates', x.split('.js').join('.html')
      ))).map(x => `<script src="/template-to-js/${
        x.split('.js').join('.html')}"></script>`).join('');
      res.send(`document.write('${html}')`);
    });

    // Convert a template to a js render method
    app.get('/template-to-js/:template', (req, res) => {
      let html = fs.readFileSync(path.join(
        __dirname, '/www/templates', req.params.template));
      html = req.params.template.split('.html')[0] +
        '.prototype.render = function(){ return `\n' + html + '\n`};'
      res.send(html);
    });


    // start the sass compiler
    for (let conf of config.sass) {
      new Sass(conf);
    }

    app.use(flexjson);



    // Serve the index page everywhere so that the
    // frontend router can decide what to do
    app.use((req, res, next) => {
      if (req.url === '/jsonflex.js' || req.url == '/json-save') {
        next();
        return;
      }
      res.sendFile(path.join(__dirname, '/www/index.html'));
    });




    // Start the web server
    app.listen(3006, () => console.log('Go to the cinema on port 3006'));

  }

}