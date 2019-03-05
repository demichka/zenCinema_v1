class Film extends Component {
  constructor(data) {
    super(data);
    this.trailer = new Trailer(this.youtubeTrailers);
  }
}