class Trailer extends Component {
  constructor(data) {
    super();
    this.ytLink = data;
    this.addEvents({
      'click .trailer-close': 'trailerClose'
    });
  }

  trailerClose() {
    $('#trailerModal').on('hidden.bs.modal', function (e) {
      $('#trailerModal iframe').attr("src", $('#trailerModal iframe').attr("src"));
    });
  }
}

