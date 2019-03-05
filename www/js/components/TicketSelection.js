class TicketSelection extends Component {
  constructor(bookingSum,grid) {
    super();
    this.tickets = [];
    this.maxTickets = 8;
    this.numOfTickets = 2;
    this.bookingSummary = bookingSum;
    this.grid = grid;
    Store.numOfTickets = this.numOfTickets;
    this.setTickets().then(data => {
      for (let i = 0; i < data.length; i++) {
        let ticketData = data[i];
        let ticket = new TicketPrice(ticketData, this);
        this.tickets.push(ticket);
        this.render();
      }
      Store.reservedTickets = this.totalCost(this.tickets);
      this.bookingSummary.render();
      this.render();

    });
  }

  async setTickets() {
    let tickets = await TicketPrice.find();
    return tickets;
  }

   totalCost(tickets) {
      let totalCost = 0;
      let ticketType = '';
      let ticketsCost;
      for (let i = 0; i < tickets.length; i++) {
        ticketType = tickets[i];
        let ticketQuantity = ticketType.ticketQuantity;
        ticketsCost = parseInt(ticketType.price) * ticketQuantity;
        totalCost = totalCost + ticketsCost;
      }
      return totalCost;
    }

}