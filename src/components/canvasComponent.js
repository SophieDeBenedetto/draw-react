import React from 'react'
import DefaultShape from './defaultShape'
import fetch from 'isomorphic-fetch'
import _ from 'lodash'
const socket = io();

export default class CanvasComponent extends React.Component {
  constructor(){
    super();
    this.state = {
      shapes: []
    }
    this.handleClick = this.handleClick.bind(this)
    debugger;
    socket.on('draw event', (newDrawState) => this.handleStateChange(newDrawState));
  }

  handleStateChange(newDrawState) {
    debugger;
    this.setState({
      shapes: [...this.state.shapes, newDrawState]
    })
  }

  postDrawing(coords) {
    return fetch('http://localhost:8080/draw', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          drawCoords: coords
        })
      })
  }

  handleClick(ev){
    ev.preventDefault();
    const coords = [ev.pageX, ev.pageY-55]
    fetch('http://localhost:8080/draw', {
        method: 'post',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          drawCoords: [ev.pageX, ev.pageY-55]
        })
      })
    //this.postDrawing(coords)
    // _.debounce(this.postDrawing(coords), 300)
   
    // this.setState({
    //   shapes: [...this.state.shapes, [ev.pageX, ev.pageY-55]]
    // })
    // console.log(this.state.shapes);
  }

  render(){
    let rendered = this.state.shapes.map((shape, i) => <DefaultShape xCo={shape[0]} yCo={shape[1]} key={i}/>)
    return (
      <div id="painting">
        <canvas onMouseMove={this.handleClick} id="ourCanvas" width="700" height="400" style={{backgroundColor: '#008811', borderRadius: 10, borderWidth: 0.5, borderColor: '#d6d7da', opacity: '0.75'}}>
          {rendered}
        </canvas>
      </div>
    )
  }
}
