import React, {Component} from 'react';
import axios from "axios"
import Promise from 'es6-promise'

// ES6 promise and Axios needed for IE
require('es6-promise').polyfill()

class MovieFinder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allGenres: [],
      selectedGenre: false,
      loading: true
    }

    this.getGenres();
  }

  // Remove spaces from string and conver to lower case
  removeSpacesFromString = (str) => {
    return str.replace(/\s/g, "-").toLowerCase()
  }

  async getGenres() {
    const genreAPI = "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=dac5b022e22ea5e143299240ca8c8d68"
    // Use this
    let _this = this
    try {
      // Use ES7's await along with async to only return this function when it's finished getting the data
      const response = await axios.get(genreAPI).then(function(genres) {
        /*
          Set state:
            state.apiModels = returned data (Slice is used to remove the standard "All models" option that is at the begining of every array)
            state.loading = false (this will remove the loading indicator)
            ----------
            Callback function to sanitize the models and remove any we don't have images for
        */
        _this.setState({
          allGenres: genres.data.genres.map(genre => (genre)),
          loading: false
        })
      })
    }
    // Console warn the error if there is one
    catch(error) {
      console.warn(error)
    }
  }

  genreBoxStyle = (imageName) => {
    let imagePath = "/assets/images/genres/" + this.removeSpacesFromString(imageName) + ".jpg"
    // Prepend cors.io link to dataURL if we're working locally
    if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
      imagePath = imagePath
    }
    else {
      imagePath = "/Findafilm" + imagePath
    }
    return {
      backgroundImage: "url(" + imagePath + ")"
    }
  }

  renderGenres = () => {
    const output = this.state.allGenres.map((genre, i) => {
      return (
        <div key={genre.id} className="col-6 col-sm-4 col-md-3">
          <div
            className={"genre-box text-center genre-box--" + this.removeSpacesFromString(genre.name)}
            style={this.genreBoxStyle(this.removeSpacesFromString(genre.name))}
          >
            <div className="genre-box__overlay">
              {genre.name}
            </div>
          </div>
        </div>
      )
    })
    return output
  }

  render() {
    return (
      <>
        <div className="row">
          {this.renderGenres()}
        </div>
      </>
    );
  }
}

export default MovieFinder
