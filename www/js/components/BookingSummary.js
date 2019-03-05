class BookingSummary extends Component {
  constructor(booking) {
    super();
    this.film = booking.film;
    this.saloonName = booking.saloonName;
    this.showingDate = booking.showingDate;
    this.time = booking.time;
    this.reservedSeats = booking.reservedSeats;
    this.totalCost = booking.totalCost;
  }
}