import React, {Component} from 'react';
import colours from "../utils/colours";

class GenreBox extends Component {
  constructor(props) {
    super(props);
  }

  // Remove spaces from string and conver to lower case
  removeSpacesFromString = (str) => {
    return str.replace(/\s/g, "-").toLowerCase()
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

  genreOverlayStyle = (i) => {
    return {
      backgroundColor: colours[i] + "bf"
    }
  }

  render() {
    return (
      <div className="col-6 col-sm-4 col-md-3">
        <div
          className={"genre-box text-center genre-box--" + this.removeSpacesFromString(this.props.name)}
          style={this.genreBoxStyle(this.removeSpacesFromString(this.props.name))}
        >
          <a
            href="#"
            className="genre-box__overlay"
            style={this.genreOverlayStyle(this.props.i)}
            onClick={e => this.props.click(e, this.props.id)}
          >
            {this.props.name}
          </a>
        </div>
      </div>
    );
  }
}

export default GenreBox
