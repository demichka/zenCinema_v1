class BookingPage extends Component {
  constructor() {
    super();
  }

  createBookingSystem(showingId) {
    this.bookingSystem = new BookingSystem(showingId);
    this.render();
    this.baseEl.modal('show');
  }

  unmount() {
    Store.chosenSeats = [];
  }
}