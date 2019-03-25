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
      allLanguages: [],
      selectedGenre: "",
      loading: true,
      medium: "movie",
      minVotes: "",
      minRating: "",
      language: "en"
    }

    this.getGenres = this.getGenres.bind(this)
    this.getMovies = this.getMovies.bind(this)
    this.getGenres()
    this.getLanguages()
  }

  // Remove spaces from string and conver to lower case
  removeSpacesFromString = (str) => {
    return str.replace(/\s/g, "-").toLowerCase()
  }

  async getLanguages() {
    const languagesAPI = "https://api.themoviedb.org/3/configuration/languages?api_key=dac5b022e22ea5e143299240ca8c8d68"

    let _this = this
    try {
      // Use ES7's await along with async to only return this function when it's finished getting the data
      const response = await axios.get(languagesAPI).then(function(languages) {
        /*
          Set state:
            state.apiModels = returned data (Slice is used to remove the standard "All models" option that is at the begining of every array)
            state.loading = false (this will remove the loading indicator)
            ----------
            Callback function to sanitize the models and remove any we don't have images for
        */
        _this.setState({
          allLanguages: languages.data.map(language => (language))
        })
      })
    }
    // Console warn the error if there is one
    catch(error) {
      console.warn(error)
    }
  }

  async getGenres() {
    const genreAPI = "https://api.themoviedb.org/3/genre/" + this.state.medium + "/list?language=en-US&api_key=dac5b022e22ea5e143299240ca8c8d68"

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
    this.setState({selectedGenre: id})
    if(e !== undefined) e.preventDefault()
    const moviesAPI = "https://api.themoviedb.org/3/discover/" + this.state.medium + "?with_genres="+ id +"&api_key=dac5b022e22ea5e143299240ca8c8d68&with_original_language=" + this.state.language + "&vote_average.gte=" + this.state.minRating + "&vote_count.gte=" + this.state.minVotes
    let _this = this
    // Use this
    try {
      // Use ES7's await along with async to only return this function when it's finished getting the data
      const response = await axios.get(moviesAPI).then(async function(movies) {
        let foundMovie
        let totalPages = movies.data.total_pages
        if (totalPages > 1000) totalPages = 1000
        let randPage = Math.floor(Math.random() * (totalPages - 1) + 2)
        let randResult = Math.floor(Math.random() * (19 - 0))
        const randMoviesAPI = "https://api.themoviedb.org/3/discover/" + _this.state.medium + "?with_genres="+ id +"&page=" + randPage +"&api_key=dac5b022e22ea5e143299240ca8c8d68&with_original_language=" + _this.state.language + "&vote_average.gte=" + _this.state.minRating + "&vote_count.gte=" + _this.state.minVotes
        try {
          // Use ES7's await along with async to only return this function when it's finished getting the data
          const randResponse = await axios.get(randMoviesAPI).then(function(movies) {
            if(movies.data.results[randResult] == undefined || movies.data.results[randResult] == null || movies.data.results[randResult] == []) foundMovie = "none"
            else foundMovie = movies.data.results[randResult]
            _this.setState({
              currentMovie: foundMovie,
              currentGenre: id,
              loading: false
            })
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
    let title
    let medium
    this.state.currentMovie.title ? title = this.state.currentMovie.title : title = this.state.currentMovie.name
    this.state.medium == "movie" ? medium = "movie" : medium = "tv show"
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
    if(this.state.currentMovie == "none") {
      return (
        <div className="col-sm-12 text-center p-2">
          <h3 className="text-center">Sorry! No movies found with your criteria</h3>
          <a
            href="#"
            onClick={e => this.reset(e)}
            className="btn btn-info"
          >
            Start again
          </a>
        </div>
      )
    }
    else {
      return (
        <>
          <div className="col-sm-12 col-md-5">
            <div className="movie__image mb-3">
              <img
                src={imagePath}
                alt={title}
              />
            </div>
          </div>
          <div className="col-sm-12 col-md-7">
            <h2>{title}</h2>
            <h4>Summary</h4>
            <p>{this.state.currentMovie.overview}</p>
            <p><strong>Release date:</strong>{" " + this.state.currentMovie.release_date}</p>
            <p><strong>Rating:</strong>{" " + this.state.currentMovie.vote_average + "/10"}</p>
          </div>
          <div className="col-sm-12">
            <div className="text-center">
              <a
                href="#"
                onClick={e => this.getMovies(e, this.state.currentGenre)}
                className="btn btn-main mr-2"
              >
                {"Another random " + medium}
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
  }

  updateFilters = (e) => {
    this.setState({
      [event.target.name]: event.target.value
    }, () => {
      if(this.state.currentMovie) {
        this.getMovies(undefined, this.state.selectedGenre)
      }
    })
  }

  renderLanguages = () => {
    const languageOptions = this.state.allLanguages.sort().map(language => {
      let languageName
      if(language.name == "No Language") languageName = "Any"
      else if(language.name == "") languageName = language.english_name
      else languageName = language.name

      return <option key={language.iso_639_1} value={language.iso_639_1}>{languageName}</option>
    })
    return languageOptions
  }

  renderFilters = () => {
    return (
      <div className="filters">
        <div className="container">
          <div className="row">
            <div className="col-sm-12">
              <div className="switch-field d-flex mb-3">
            		<input
                  type="radio"
                  name="medium"
                  id="moviesRadio"
                  value="movie"
                  checked={this.state.medium == "movie"}
                  onChange={e => this.updateFilters(e)}
                />
            		<label htmlFor="moviesRadio">Movies</label>
            		<input
                  type="radio"
                  name="medium"
                  id="tvRadio"
                  value="tv"
                  checked={this.state.medium == "tv"}
                  onChange={e => this.updateFilters(e)}
                />
            		<label htmlFor="tvRadio">TV Shows</label>
            	</div>
            </div>
            <div className="col-sm-12 remainingFilters">
              <div className="d-block d-md-inline-block mr-md-3 mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="languageSelect">Language</label>
                  </div>
                  <select className="custom-select" name="language" id="languageSelect" onChange={e => this.updateFilters(e)}>
                    {this.renderLanguages()}
                  </select>
                </div>
              </div>
              <div className="d-block d-md-inline-block mr-md-3 mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="minVotesSelect">Minimum votes</label>
                  </div>
                  <select className="custom-select" name="minVotes" id="minVotesSelect" onChange={e => this.updateFilters(e)}>
                    <option value="">None</option>
                    <option value={100}>100</option>
                    <option value={200}>200</option>
                    <option value={300}>300</option>
                    <option value={400}>400</option>
                    <option value={500}>500</option>
                    <option value={600}>600</option>
                    <option value={700}>700</option>
                    <option value={800}>800</option>
                    <option value={900}>900</option>
                    <option value={1000}>1000</option>
                  </select>
                </div>
              </div>
              <div className="d-block d-md-inline-block mr-md-3 mb-3">
                <div className="input-group">
                  <div className="input-group-prepend">
                    <label className="input-group-text" htmlFor="minRatingSelect">Minimum rating</label>
                  </div>
                  <select className="custom-select" name="minRating" id="minRatingSelect" onChange={e => this.updateFilters(e)}>
                    <option value="">None</option>
                    <option value={1}>1/10</option>
                    <option value={2}>2/10</option>
                    <option value={3}>3/10</option>
                    <option value={4}>4/10</option>
                    <option value={5}>5/10</option>
                    <option value={6}>6/10</option>
                    <option value={7}>7/10</option>
                    <option value={8}>8/10</option>
                    <option value={9}>9/10</option>
                    <option value={10}>10/10</option>
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
