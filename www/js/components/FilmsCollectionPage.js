class FilmsCollectionPage extends Component {

  constructor(){
    super();
    this.addRoute('/films', 'Filmer'); 
    this.loadInFilms().then(filmPosters => {
      this.filmPosters = filmPosters;
      this.render();
    });
    this.filmCarousel = new FilmCarousel();
    
  }
  async loadInFilms(){
    let allFilms = await Film.find();
    let allFilmPosters = [];
    for(let i = 0; i < allFilms.length; i++){
      let film = allFilms[i];
      let filmPoster = new FilmPoster(film._props);
      allFilmPosters.push(filmPoster);
    }
    return allFilmPosters;
  }
}