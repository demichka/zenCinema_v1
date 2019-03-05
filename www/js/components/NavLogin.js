class NavLogin extends Component {

  constructor(parent) {
    super();
    this.addEvents({
      'click .login-btn': 'clickLoginBtn',
      'click .logout-btn': 'logout',
      'click .new-account-btn': 'createRegisterForm'
    });
    this.loggedIn = false;
    this.checkLogin();
    this.parent = parent;
  }
  createRegisterForm() {
    this.parent.registerForm = new RegisterForm(this.parent, this);
    this.parent.render();
  }
  async checkLogin() {
    let result = await Login.find();
    if (result.loggedIn) {
      this.loggedIn = true;
      this.loggedInUser = result.user;
      Store.loggedInUser = this.loggedInUser;
      this.render();
    }
  }

  async login() {
    let email = this.baseEl.find('.email-login-input').val();
    let password = this.baseEl.find('.password-login-input').val();

    let login = new Login({
      email: email,
      password: password
    });

    let result = await login.save();

    if (result.loggedIn) {
      this.loggedIn = true;
      this.loggedInUser = result.user;
      Store.loggedInUser = this.loggedInUser;
      if (this.parent instanceof BookingSystem){
      this.parent.loggedInUser = this.loggedInUser;
      this.parent.registerForm = 0;
      this.baseEl.remove();
      this.used = true;
      this.parent.render();
      }
      this.render();
    }
    else {
      window.alert('error while login');
    }
  }


  clickLoginBtn(e) {
    e.preventDefault();
    this.login();
  }

  async logout() {
    let loginObj = new Login();
    await loginObj.delete();
    this.loggedIn = false;
    window.location.href = 'http://localhost:3005/';
    Store.loggedInUser = undefined;
    this.render();
  }
}