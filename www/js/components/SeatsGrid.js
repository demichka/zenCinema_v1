class SeatsGrid extends Component {
  constructor(schema, takenSeats, bookingSum, bestRows) {
    super();
    this.schema = schema;
    this.takenSeats = takenSeats;
    this.hoveredSeats = [];
    this.bookingSum = bookingSum;
    this.bestRows = bestRows;
    this.grid = this.createGrid();
    this.bookingSum.render();
  }



  createGrid() {
    let hall = [];
    for (let i = 0; i < this.schema.length; i++) {
      let row = new Row();
      for (let j = this.schema[i]; j >= 1; j--) {
        let seat = new Seat(i + 1 + '-' + j, this);
        for (let t = 0; t < this.takenSeats.length; t++) {
          let taken = this.takenSeats[t];
          if (taken === seat.name) {
            seat.taken = true;
          }
        }
        row.seats.push(seat);
      }
      hall.push(row);
    }

    for (let i = 0; i < hall.length; i++) {
      let row = hall[i];
      let rowIndex = hall.indexOf(row);
      for (let best = 0; best < this.bestRows.length; best++) {
        if (rowIndex === this.bestRows[best] - 1) {
          row.best = true;
        }
      }
    }

    delete this.chosenSeats;
    delete Store.chosenSeats;

    for (let row of hall.filter(row => row.best)) {
      let bestSeatIndex = Math.floor((row.seats.length + 1) / 2);
      let bestRowSeats = row.seats;
      
      for (let s = 0; s < bestRowSeats.length; s++) {
        let seat = bestRowSeats[s];
        let seatFriend = bestRowSeats[s-1];
        let seatIndex = bestRowSeats.indexOf(seat);
        
        if (!seat.taken && seatIndex === bestSeatIndex && !seatFriend.taken) {
          seat.best = true;
          seatFriend.best = true;
          this.chosenSeats = [seat, seatFriend];
          Store.chosenSeats = [seat.name, seatFriend.name];
          break;
        }
      }

      if (this.chosenSeats) {
        break;
      }
    }
    
    return hall;
  }

  hoverSeats(seat, numOfTickets) {
    let hoveredSeat = seat[0].name;
    let rowNr = parseInt(hoveredSeat.split('-')[0]);
    let seatNr = parseInt(hoveredSeat.split('-')[1]);

    for (let i = seatNr; i > seatNr - numOfTickets; i--) {
      if (i > 0 && !this.takenSeats.includes(rowNr + '-' + i)) {
        this.hoveredSeats.push(rowNr + '-' + i);
      } else {
        for (let seat of this.hoveredSeats) {
          this.baseEl.find(`#${seat}`).addClass('invalid-seats');
        }
        this.hoveredSeats = [];
        break;
      }
    }

    if (this.hoveredSeats.length !== 0) {
      for (let seat of this.hoveredSeats) {
        this.baseEl.find(`#${seat}`).addClass('valid-seats');
      }
    }
  }

  unhoverSeats() {
    this.baseEl.find('.seat').removeClass('invalid-seats');
    this.baseEl.find('.seat').removeClass('valid-seats');
    this.hoveredSeats = [];

    for (let row of this.grid) {
      for (let seat of row.seats) {
        seat.best = false;
      }
    }
    this.chosenSeats = [];
    this.bookingSum.render();
  }

  chooseSeats() {
    if (this.hoveredSeats.length === 0) {
      return;
    } else {
      this.baseEl.find('.seat').removeClass('chosen-seats');
      for (let row of this.grid) {
        for (let seat of row.seats) {
          seat.best = false;
        }
      }
      this.chosenSeats = [];
      this.chosenSeats = this.hoveredSeats;
      Store.chosenSeats = this.chosenSeats;
      for (let seat of this.chosenSeats) {
        this.baseEl.find(`#${seat}`).addClass('chosen-seats').removeClass('valid-seats');
      }
      this.bookingSum.render();
    }
  }

}