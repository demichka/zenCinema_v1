class StartPage extends Component {

  constructor() {
    super();
    this.addRoute('/', '');
    this.calendarShowing = new CalendarShowing();
    this.filmCarousel = new FilmCarousel();
    this.zenCoin = new ZenCoin();
  }
}