class RegisterPage extends Component {

  constructor() {
    super();
    this.addRoute('/register', 'Register');
    this.registerForm = new RegisterForm(this, undefined);
  }
  
}
