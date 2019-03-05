class BookingSystem extends Component {
  constructor(showingId) {
    super();
    this.showingId = showingId;
    this.checkLogin().then(login => {
      if(login.loggedIn) {
        this.loggedInUser = login.user;
      }
    });
    this.showingData(this.showingId)
      .then(data => {
        this.showing = data;
        this.showingDate = new Date(this.showing.date).toLocaleString('sv-SE', { weekday: 'long', month: 'long', day: 'numeric' });
        this.saloon = this.showing.saloon;
        this.film = this.showing.film;
        this.time = this.showing.time;
      })
      .then(() => {
        return Promise.all([this.findSaloonSchema(this.saloon), this.findFilm(this.film), this.findTakenSeats()]).then(data => {
          const saloonSchemaData = data[0];
          const filmData = data[1];
          const takenSeats = data[2];

          this.saloonSchema = saloonSchemaData.seatsPerRow;
          this.bestRows = saloonSchemaData.bestRows;
          this.saloonName = saloonSchemaData.name;
          this.film = filmData;
          this.takenSeats = takenSeats;
          this.bookingSummary = new BookingSummary(this);
          this.seatsGrid = new SeatsGrid(this.saloonSchema, this.takenSeats, this.bookingSummary, this.bestRows);
          this.ticketSelection = new TicketSelection(this.bookingSummary, this.seatsGrid);
          this.render();
        });
      });
    this.addEvents({
      'click .save-booking': 'saveBooking',
      'click .open-login-form': 'openLoginForm'
    });
  }

  unmount() {
    Store.chosenSeats = [];
    console.log(Store.chosenSeats);

  }
  async showingData(showingId) {
    let showing = await Showing.find(showingId);
    return showing;
  }

  async findSaloonSchema(saloonId) {
    return await Saloon.find(saloonId);
  }

  async findFilm(filmId) {
    return await Film.find(filmId);
  }

  async findTakenSeats() {
    let bookings = await Booking.find(`.find({show: '${this.showingId}'}).populate('show').exec()`);
    let takenSeats = [];
    for (let i = 0; i < bookings.length; i++) {
      let booking = bookings[i];
      let seats = booking.seats;
      takenSeats = takenSeats.concat(seats);
    }
    return takenSeats;
  }

  async generateBookingNumber() {
    let bookings = await Booking.find(`.find().limit(1).sort({$natural: -1})`);
    let saltArray = 'qwertyuiopasdfghjklzxcvbnmQWERTYUIOPASDFGHJKLZXCVBNM';
    saltArray = saltArray.split("");
    let salt = '';
    let lastBookingNumber = '';
    for (let i = 0; i <= 3; i++) {
      let letter = saltArray[Math.floor(Math.random() * saltArray.length)];
      salt = salt + letter;
    }
    let number = 0;
    if (bookings.length === 0) {
      number = salt + 1;
    }
    if (bookings.length > 0) {
      lastBookingNumber = bookings[0].bookingNumber;
      lastBookingNumber = parseInt(lastBookingNumber.split("").splice(4));
      number = salt + (lastBookingNumber + 1);
    }
    return number;
  }

  async checkLogin() {
    return await Login.find();
  }

  openLoginForm() {
    this.loginForm = new NavLogin(this);
          this.registerForm = '';
          this.render();
  }

  async checkUnvailableSeats() {
    let takenSeats = await this.findTakenSeats();
    for (let i = 0; i < Store.chosenSeats.length; i++) {
      if (takenSeats.includes(Store.chosenSeats[i])){
        return true;
      }
    }
  }

  async saveBooking() {
    if (this.loggedInUser && 
      Store.chosenSeats !== undefined && 
      Store.reservedTickets !== undefined && 
      Store.reservedTickets !== 0 && 
      Store.chosenSeats.length === Store.numOfTickets) {
      let number = await this.generateBookingNumber();
      this.newBooking = new Booking({
        "customer": this.loggedInUser ? this.loggedInUser._id : "Here will be userId",
        "show": this.showing._id,
        "seats": Store.chosenSeats,
        "bookingNumber": number,
        "totalCost": Store.reservedTickets + " SEK"
      });

      //try to save and catch an error if chosen seats have been taken before this booking finished
      try {
        await this.newBooking.save();
      } catch (error) {
        if (error.status === 409) {
      let takenSeats = await this.findTakenSeats();
      for (let i = 0; i < takenSeats.length; i++) {
        for (let j = 0; j < this.seatsGrid.grid.length; j++) {
          let row = this.seatsGrid.grid[j];
          for (let seat = 0; seat < row.seats.length; seat++) {
            if (row.seats[seat].name === takenSeats[i]) {
              row.seats[seat].taken = true;
              row.seats[seat].render();
            }
          }
        }
      }    
      this.message = new Message('alreadyBooked');
      this.render();
          return;
        }
        throw error;
      }

      this.message = new Message('newBooking', this.newBooking);
      this.render();
      this.newBooking = '';
      delete Store.chosenSeats;
    }
    else if (Store.chosenSeats === undefined || Store.chosenSeats.length === 0) {
      this.message = new Message('chooseSeats');
      this.render();
    }
    else if (Store.reservedTickets === undefined || Store.reservedTickets === 0) {
      this.message = new Message('chooseTickets');
      this.render();
    }
    
  }
}