class FilmPage extends Component {

  constructor() {
    super();
    this.addRoute(/^\/film\/[a-z0-9\-]+$/);
  }

  mount() {
    let path = location.pathname;
    const film = path.split('/')[2].split('-').join(' ');
    this.findFilm(film).then(data => {
      this.film = data[0]._id;
    }).then(() => {
      this.content = new FilmPageContent(this.film);
      this.render();
    });
  }


  async findFilm(film) {
    let filmId = await Film.find(`.find({title: /${film}/i})`);
    return filmId;
  }
}