import React, {Component} from 'react';
import axios from "axios"
import Promise from 'es6-promise'
import GenreBox from "./GenreBox";

// ES6 promise and Axios needed for IE
require('es6-promise').polyfill()

class MovieFinder extends Component {
  constructor(props) {
    super(props);

    this.state = {
      allGenres: [],
      selectedGenre: false,
      loading: true,
      movies: true,
      tv: false,
      minRating: false
    }

    this.getGenres = this.getGenres.bind(this)
    this.getMovies = this.getMovies.bind(this)
    this.getGenres()
  }

  // Remove spaces from string and conver to lower case
  removeSpacesFromString = (str) => {
    return str.replace(/\s/g, "-").toLowerCase()
  }

  async getGenres() {
    const genreAPI = "https://api.themoviedb.org/3/genre/movie/list?language=en-US&api_key=dac5b022e22ea5e143299240ca8c8d68"

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

  async getMovies(e, id) {
    e.preventDefault()
    const moviesAPI = "https://api.themoviedb.org/3/discover/movie?with_genres="+ id +"&api_key=dac5b022e22ea5e143299240ca8c8d68&language=en&vote_average.gte=8&original_language=en"
    let _this = this
    // Use this
    try {
      // Use ES7's await along with async to only return this function when it's finished getting the data
      const response = await axios.get(moviesAPI).then(async function(movies) {
        let totalPages = movies.data.total_pages
        if (totalPages > 1000) totalPages = 1000
        let randPage = Math.floor(Math.random() * (totalPages - 1) + 1)
        let randResult = Math.floor(Math.random() * (19 - 0))
        const randMoviesAPI = "https://api.themoviedb.org/3/discover/movie?with_genres="+ id +"&page=" + randPage +"&api_key=dac5b022e22ea5e143299240ca8c8d68&language=en"

        try {
          // Use ES7's await along with async to only return this function when it's finished getting the data
          const randResponse = await axios.get(randMoviesAPI).then(function(movies) {
            _this.setState({
              currentMovie: movies.data.results[randResult],
              currentGenre: id,
              loading: false
            }, () => console.log(_this.state.currentMovie))
          })
        }
        // Console warn the error if there is one
        catch(error) {
          console.warn(error)
        }
      })
    }
    // Console warn the error if there is one
    catch(error) {
      console.warn(error)
    }
  }

  renderGenres = () => {
    const output = this.state.allGenres.map((genre, i) => {
      return (
        <GenreBox
          key={genre.id}
          name={genre.name}
          i={i}
          id={genre.id}
          click={this.getMovies}
        />
      )
    })
    return output
  }

  reset = (e) => {
    e.preventDefault()
    this.setState({
      currentMovie: false
    })
  }

  renderMovie = () => {
    let imagePath = "https://image.tmdb.org/t/p/w500"
    if (this.state.currentMovie.poster_path !== null) {
      imagePath = imagePath + this.state.currentMovie.poster_path
    }
    else {
      imagePath = "/assets/images/poster-not-found.png"
      // Prepend cors.io link to dataURL if we're working locally
      if (location.hostname === "localhost" || location.hostname === "127.0.0.1") {
        imagePath = imagePath
      }
      else {
        imagePath = "/Findafilm" + imagePath
      }
    }
    return (
      <>
        <div className="col-sm-12 col-md-5">
          <div className="movie__image mb-3">
            <img
              src={imagePath}
              alt={this.state.currentMovie.title}
            />
          </div>
        </div>
        <div className="col-sm-12 col-md-7">
          <h2>{this.state.currentMovie.title}</h2>
        </div>
        <div className="col-sm-12">
          <div className="text-center">
            <a
              href="#"
              onClick={e => this.getMovies(e, this.state.currentGenre)}
              className="btn btn-main mr-2"
            >
              Another movie
            </a>
            <a
              href="#"
              onClick={e => this.reset(e)}
              className="btn btn-info"
            >
              Start again
            </a>
          </div>
        </div>
      </>
    )
  }

  renderFilters = () => {
    return (
      <div className="filters">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="switch-field d-inline mr-3">
            		<input
                  type="radio"
                  name="movie_tv"
                  id="moviesRadio"
                  value="movies"
                  checked={this.state.movies}
                  onChange={e => this.setState({movies: true, tv: false})}
                />
            		<label htmlFor="moviesRadio">Movies</label>
            		<input
                  type="radio"
                  name="movie_tv"
                  id="tvRadio"
                  value="tv"
                  checked={this.state.tv}
                  onChange={e => this.setState({tv: true, movies: false})}
                />
            		<label htmlFor="tvRadio">TV Shows</label>
            	</div>
              <div className="d-inline-block">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="languageSelect">Language</label>
                  </div>
                  <select className="custom-select" id="languageSelect">
                    <option defaultValue>Any</option>
                    <option value="en">English</option>
                    <option value="fr">French</option>
                    <option value="jp">Japanese</option>
                  </select>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }

  render() {
    return (
      <>
        {this.renderFilters()}
        <div className="container">
          <div className="row">
            {(!this.state.currentMovie && this.renderGenres())}
            {(this.state.currentMovie && this.renderMovie())}
          </div>
        </div>
      </>
    );
  }
}

export default MovieFinder
