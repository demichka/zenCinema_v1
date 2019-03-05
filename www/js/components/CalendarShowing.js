class CalendarShowing extends Component {
  constructor() {
    super();
    this.showingData = [];

    this.loadShowingData();
  }

  async loadShowingData() {
    let today = new Date().getTime();
    this.showingData = await Showing.find(`.find({date: {$gte: ${today}}}).limit(9).sort({$natural: 1}).populate('film').exec()`);    
    this.render();
  }
}