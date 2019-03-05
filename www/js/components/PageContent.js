class PageContent extends Component {

  constructor() {
    super();
    this.startPage = new StartPage();
    this.missingPage = new MissingPage();
    this.registerPage = new RegisterPage();
    this.filmPage = new FilmPage();
    this.customerBookingsPage = new CustomerBookingsPage();
    this.saloonTechInfoPage = new SaloonTechInfoPage();
    this.filmsCollectionPage = new FilmsCollectionPage();
    this.kioskPage = new KioskPage();
    this.rulePage = new RulePage();
    this.allShowings = new ShowingsCalendar();

  }

}