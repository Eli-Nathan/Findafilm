import React from 'react'
import ReactDOM from 'react-dom'
import ImageGallery from './components/ImageGallery'

let imageGallery = document.getElementById("image-gallery")
let imageGallery2 = document.getElementById("image-gallery2")

const images = [
  {
    path: "https://images.unsplash.com/photo-1550851985-f79ef89f3578?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=1510&q=80",
    alt: "BMW in the sun",
    caption: "BMW 5-series in a lumber yard"
  },
  {
    path: "https://images.unsplash.com/photo-1551115190-75708aec3314?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Departure lounge",
    caption: "Departure lounge"
  },
  {
    path: "https://images.unsplash.com/photo-1551708769-d1525c52cccc?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Stack of vinyls",
    caption: "Stack of vinyls with Queen record at the top"
  },
  {
    path: "https://images.unsplash.com/photo-1550945135-3f8d8b938111?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Bus",
    caption: "London Buss"
  },
  {
    path: "https://images.unsplash.com/photo-1549780450-4e6066b727df?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Sheep in field",
    caption: "Sheep in field"
  },
  {
    path: "https://images.unsplash.com/photo-1551010457-3cdd802dfa3c?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Alleyway",
    caption: "Alleyway in Eastern City"
  },
  {
    path: "https://images.unsplash.com/photo-1550837725-bdcb030d1e54?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Newyork",
    caption: "Newyork city-scape"
  },
  {
    path: "https://images.unsplash.com/photo-1551525212-a1dc18871d4a?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Sunny Hotel building",
    caption: "Hotel reception with large open windows"
  },
  {
    path: "https://images.unsplash.com/photo-1551660209-9ceaab86a803?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Snowboarder image gallery",
    caption: "Lone snowboarder on a slope"
  },
  {
    path: "https://images.unsplash.com/photo-1551376347-075b0121a65b?ixlib=rb-1.2.1&q=80&fm=jpg&crop=entropy&cs=tinysrgb&w=1510&h=1000&fit=crop&ixid=eyJhcHBfaWQiOjF9",
    alt: "Pink hills image gallery",
    caption: "Pink haze over hills"
  }
]

ReactDOM.render( <ImageGallery images={images} style={"4/3"} />, imageGallery )

ReactDOM.render( <ImageGallery images={images} style={"grid"} />, imageGallery2 )
