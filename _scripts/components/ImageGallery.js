import React, {Component} from 'react';

class ImageGallery extends Component {
  constructor(props) {
    super(props);

    this.state = {
      showLightbox: false
    }
  }

  // Handle Keydown function with event parameter
  handleKeyDown = (event) => {
    // If the lightbox is showing
    if(this.state.showLightbox) {
      // Define buttons and keycodes
      let firstArrow = document.querySelector(".lightbox .arrows .arrows__left")
      let lastArrow = document.querySelector(".lightbox .arrows .arrows__right")
      let closeIcon = document.querySelector(".lightbox .close-button")
      let TAB_KEY = 9
      let ESCAPE_KEY = 27
      let LEFT_ARROW = 37
      let RIGHT_ARROW = 39
      // If esc is clicked, call the close function
      if(event.keyCode == ESCAPE_KEY) this.onClose()
      // If left arrow is clicked, call the changeImage function
      if(event.keyCode == LEFT_ARROW) this.changeImage(-1)
      // If left arrow is clicked, call the changeImage function
      if(event.keyCode == RIGHT_ARROW) this.changeImage(1)
      // If tab is clicked, keep focus on the arrows
      if(event.keyCode == TAB_KEY && !event.shiftKey) {
        console.log(document.activeElement);
        if(document.activeElement == firstArrow) {
          event.preventDefault()
          lastArrow.focus()
        }
        else if(document.activeElement == lastArrow) {
          event.preventDefault()
          closeIcon.focus()
        }
        else {
          event.preventDefault()
          firstArrow.focus()
        }
      }
      if(event.keyCode == TAB_KEY && event.shiftKey) {
        if(document.activeElement == firstArrow) {
          event.preventDefault()
          closeIcon.focus()
        }
        else if(document.activeElement == lastArrow) {
          event.preventDefault()
          firstArrow.focus()
        }
        else {
          event.preventDefault()
          lastArrow.focus()
        }
      }
    }
  }

  // onClick function
  onClick = (e, key) => {
    // Prevent default action (href="#")
    e.preventDefault()
    /*
      Set state:
        activeImage = the image's index in the array of images
        showLightbox = true
      Callback:
        - Get left arrow button and focus on it
        - Add no scroll class to body
        - Call scrollToThumb function
    */
    this.setState({
      activeImage: key,
      showLightbox: true
    }, () => {
      document.querySelector(".lightbox .arrows .arrows__left").focus()
      document.body.classList.add("no-scroll")
      this.scrollToThumb()
    })
  }

  // onClose function
  onClose = () => {
    /*
      Set state:
        showLightbox = false
      Callback:
        - Remove no scroll class from body
    */
    this.setState({
      showLightbox: false
    }, () => document.body.classList.remove("no-scroll"))
  }

  // changeImage function
  changeImage = (calc) => {
    // If first image is active and parameter is -1
    if (this.state.activeImage == 0 && calc == -1) {
      // set parameter to the length of the array to go right to the last image
      calc = this.props.images.length - 1
    }
    // If last image is active and parameter is 1
    else if (this.state.activeImage == (this.props.images.length -1) && calc == 1) {
      // set parameter to the (negative)length of the array to go right to the first image
      calc = -(this.props.images.length -1)
    }
    /*
      Set state:
        activeImage = selected image + or - calc amount
      Callback:
        - Call scrollToThumb function
    */
    this.setState(state => ({
      activeImage: state.activeImage + calc
    }), () => this.scrollToThumb())
  }

  // scrollToThumb function
  scrollToThumb = () => {
    /* Define variables for:
      - Lightbox div
      - Thumbs div
      - First thumbnail div
      - Active thumbnail div
      - The offsetTop of the clicked thumbnail on mobile devices
      - X-axis offset of first div
    */
    let lightbox = document.querySelector(".lightbox")
    let thumbs = document.querySelector(".thumbs")
    let firstThumb = document.querySelectorAll(".thumb")[0]
    let activeThumb = document.querySelector(".thumb--active")
    let activeTop = document.querySelector(".thumb--active").offsetTop
    let firstOffset = firstThumb.offsetLeft
    // Set the scroll position to show the selected thumb with some space to the left (200px)
    thumbs.scrollLeft = activeThumb.offsetLeft - firstOffset - 200
    // Set the scroll top to scroll to pressed thumbnail image for mobile devices
    lightbox.scrollTop = activeTop - 30;

  }

  /*
    galleryImage function
    Parameters:
      - cols = Chassis columns defined based on the selected style and which image it is
      - path = image.path
      - alt = image.alt
      - i = image number
  */
  galleryImage = (cols, path, alt, i) => {
    return (
      <div
        className={cols}
        key={i+100}
      >
        <a
          onClick={e => this.onClick(e, i)}
          href="#"
        >
          <div className="gallery-image">
            <img
              src={path}
              alt={alt}
              className="ch-img--responsive ch-hand gallery-image__image"
            />
            <div className="gallery-image__overlay">
            </div>
          </div>
        </a>
      </div>
    )
  }

  // renderImages function
  renderImages = () => {
    let cols
    const maxImages = this.props.style == "4/3" ? 7 : 8
    // Cleaned images array is the first 7 images
    const cleanedImages = this.props.images.slice(0, maxImages)
    // Amount is the length of that array (I've done this incase we change 7 to a different number)
    const amount = cleanedImages.length
    // Map the images
    const images = cleanedImages.map((image, i) => {
      // If the defined style is four by 3...
      if(this.props.style == "4/3") {
        // Layout for the second and third-last image
        if((amount - 1) == i + 1 || (amount - 2) == i + 1) cols = "col-6 col-sm-4 mb-4 mb-sm-4"
        // Layout for the last image
        else if(amount == i + 1) cols = "col-12 col-sm-4 mb-4 mb-sm-4"
        // Otherwise, layout is just a simple grid
        else cols = "col-6 col-sm-3 mb-4 mb-sm-4"
      }
      else if (!this.props.style || this.props.style == "grid") cols = "col-6 col-sm-3 mb-4 mb-sm-4"
      // Return an image from the galleryImage function based on the parameters from above
      return (
        this.galleryImage(cols, image.path, image.alt, i)
      )
    })
    // Return images
    return images
  }

  renderLightbox = () => {
    // Listen for keydown event and call function
    document.addEventListener("keydown", this.handleKeyDown)
    const lightbox = (
      <div className={`lightbox ${this.state.showLightbox ? "lightbox--visible" : ""}`}>
        {this.renderImage()}
        {this.renderCounter()}
        <div className={`thumbs mx-auto ${this.props.images.length < 11 ? "flex-xxl" : ""}`}>
          {this.renderThumbnails()}
        </div>
        <button
          className="float-right close-button"
          onClick={e => this.onClose(e)}
        />
      </div>
    )
    return lightbox
  }

  renderImage = () => {
    return (
      <div className="d-none d-md-flex text-center imageContainer">
        <figure>
          <div className="overlays mx-auto">
            <div
              className="overlay"
              onClick={e => this.changeImage(-1)}
            />
            <div
              className="overlay"
              onClick={e => this.changeImage(1)}
            />
          </div>
          <img
            src={this.props.images[this.state.activeImage].path}
            alt={this.props.images[this.state.activeImage].alt}
            className="featuredImage mt-md-4 mx-md-auto text-center"
          />
          <figcaption className="caption mt-1 mx-auto mb-4 text-center">{this.props.images[this.state.activeImage].caption}</figcaption>
        </figure>
        {this.renderNavigation()}
      </div>
    )
  }

  renderCounter = () => {
    return (
      <p className="counter d-none d-md-block text-center">
        {`Image ${this.state.activeImage + 1}/${this.props.images.length}`}
      </p>
    )
  }

  renderNavigation = () => {
    return (
      <div className="arrows d-none d-md-block">
        <button
          className="arrow arrows__left position-absolute"
          onClick={e => this.changeImage(-1)}
        />
        <button
          className="arrow arrows__right position-absolute"
          onClick={e => this.changeImage(1)}
        />
      </div>
    )
  }

  renderThumbnails = () => {
    const thumbs = this.props.images.map((image, i) => {
      return (
        <div
          key={i}
          className={`thumb d-md-inline-block mb-3 mb-md-0 mt-4 mt-md-2 mr-md-2${i === this.state.activeImage ? " thumb--active border-3 border-white" : ""}`}
          onClick={e => this.onClick(e, i)}
        >
          <figure>
            <img
              src={this.props.images[i].path}
              alt={this.props.images[i].alt}
              className="img-fluid mx-auto mt-4 mt-md-0"
            />
            <figcaption className="caption mt-1 mx-auto mb-4 mb-md-5 d-md-none">{this.props.images[i].caption}</figcaption>
          </figure>
        </div>
      )
    })
    return thumbs
  }


  render() {
    return (
      <div className="row">
        {this.renderImages()}
        {this.state.showLightbox ? this.renderLightbox() : null}
      </div>
    );
  }

}

export default ImageGallery
