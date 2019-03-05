class NavBar extends Component {

  constructor() {
    super();
    this.navItems = [
      new NavItem('Start', '/'),
      new NavItem('Filmer', '/films'),
      new NavItemDropdown()
    ];
    this.navLogins = new NavLogin(this);
  }

}