class ShowingsCalendar extends Component {
  
    constructor() {
      super();
      this.addRoute('/all-showings', 'Showings');
      this.showList().then(data => {
        this.showings = data;
        this.render();
      });
    }


  async showList() {
    return await Showing.find(`.find().sort({date: 1, time: 1}).populate('saloon').populate('film').exec()`);
  }

}