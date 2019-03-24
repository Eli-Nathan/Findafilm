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
      loading: true
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
    const moviesAPI = "https://api.themoviedb.org/3/discover/movie?with_genres="+ id +"&api_key=dac5b022e22ea5e143299240ca8c8d68"
    let _this = this
    // Use this
    try {
      // Use ES7's await along with async to only return this function when it's finished getting the data
      const response = await axios.get(moviesAPI).then(async function(movies) {
        let totalPages = movies.data.total_pages
        if (totalPages > 1000) totalPages = 1000
        let randPage = Math.floor(Math.random() * (totalPages - 1) + 1)
        let randResult = Math.floor(Math.random() * (19 - 0))
        const randMoviesAPI = "https://api.themoviedb.org/3/discover/movie?with_genres="+ id +"&page=" + randPage +"&api_key=dac5b022e22ea5e143299240ca8c8d68"

        try {
          // Use ES7's await along with async to only return this function when it's finished getting the data
          const randResponse = await axios.get(randMoviesAPI).then(function(movies) {
            _this.setState({
              currentMovie: movies.data.results[randResult],
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
    return (
      <div className="col-sm-12">
        <h1 className="text-center">{this.state.currentMovie.title}</h1>
        <a href="#" onClick={e => this.reset(e)}>Start again</a> | 
        <a href="#" onClick={e => this.getMovies(e, this.state.currentGenre)}>Another movie</a>
      </div>
    )
  }

  render() {
    return (
      <>
        <div className="row">
          {(!this.state.currentMovie && this.renderGenres())}
          {(this.state.currentMovie && this.renderMovie())}
        </div>
      </>
    );
  }
}

export default MovieFinder
