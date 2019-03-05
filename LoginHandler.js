const bcrypt = require('bcryptjs');
 
module.exports = class LoginHandler {
 
  constructor(app, User){
    this.app = app;
    this.User = User;
    this.createLoginRoute();
    this.createCheckIfLoggedInRoute();
    this.createLogoutRoute();
  }
 
  createLoginRoute(){
    this.app.post('/json/login', async (req,res) => {
      let data = req.body;
      let user = await this.User.findOne({email: data.email});
      if(!user){
        res.json({loggedIn: false, error: 'No such user!'});
        return;
      }
      // compare the password sent in the request (data.password)
      // with the encrypted password stored in the db (user.password)
      let match = await bcrypt.compare(data.password + passwordSalt, user.password);
      if(!match){
        res.json({loggedIn: false, error: 'The password does not match!'});
        return;
      }
      req.session.user = user;
      // save changes to session
      req.session.save();
      // successfully logged in!
      res.json({loggedIn: true, user: user});
    });
 
  }
 
  createCheckIfLoggedInRoute(){
    this.app.get('/json/login', (req, res) => {
      if(!req.session.user){
        res.json({error: 'Not logged in!', loggedIn: false});
        return;
      }
      res.json({user: req.session.user, loggedIn: true});
    });
  }
 
  createLogoutRoute(){
    this.app.delete('/json/login/*', (req, res) => {
      delete req.session.user;
      req.session.save();
      res.json({loggedIn: false});
    });
  }
 
}
