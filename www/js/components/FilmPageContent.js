class FilmPageContent extends Component {
  constructor(filmId) {
    super();
    this.filmId = filmId;
    this.bookingPage = new BookingPage();
    Promise.all([
      this.showFilmInfo(this.filmId),
      this.showingsPopulatedFilms(this.filmId),
      this.getPrices(),
    ]).then(data => {
      this.film = data[0];
      this.trailer = new Trailer(this.film);
      this.filmShowings = data[1];
      const prices = data[2];

      for (let i = 0; i < this.filmShowings.length; i++) {
        let showing = this.filmShowings[i];
        showing.setBookingAction(() => this.bookingPage.createBookingSystem(showing._id));
        showing.setPrices(prices);
      }

      this.render();
    });
  }

  async showingsPopulatedFilms(filmId) {
    let today = new Date().getTime();
    return await Showing.find(`.find({date: {$gte: ${today}}, film: '${filmId}' }).populate('saloon').populate('film').exec()`);    
  }

  async showFilmInfo(filmId) {
    return await Film.find(filmId);
  }
  
  async getPrices() {
    let prices = await TicketPrice.find();
    return prices;
  }
}
