class Showing extends Component {
  constructor(data) {
    super(data);

    this.addEvents({
      'click .book-film': 'launchModal'
    });
  }

  get dateToString() {
    return new Date(this.date).toLocaleString('sv-SE', {weekday: 'short', month: 'long', day: 'numeric'});
  }

  setPrices(prices) {
    this.prices = prices;
    this.render();
  }

  setBookingAction(actionFn) {
    this.bookingAction = actionFn;
  }
  
  launchModal() {
    if (this.bookingAction !== undefined) {
      this.bookingAction();
    }
  }
}