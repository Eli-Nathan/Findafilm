import React, {Component} from 'react';

class MovieFinder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      genres: [],
      selectedGenre: false
    }
  }

  renderGenres = () => {
    let genres = ["Action", "Comedy", "Drama"]
    const output = genres.map((genre, i) => {
      return (
        <option key={i} value={genre}>{genre}</option>
      )
    })
    return output
  }

  render() {
    return (
      <>
        <select>
          {this.renderGenres()}
        </select>
        {this.state.showLightbox ? this.renderLightbox() : null}
      </>
    );
  }
}

export default MovieFinder
