class FilmCarousel extends Component {
  constructor() {
    super();
    this.filmData = [];
    this.loadFilmData();
  }

  async loadFilmData() {
    this.filmData = await Film.find();
    this.render();
  }
}