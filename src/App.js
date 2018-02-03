import React, { Component } from 'react';
import logo from './logo.svg';
import './App.css';
import openSocket from 'socket.io-client';

const socket = openSocket('http://localhost:3001');
function subscribeToTimer(cb) {
  socket.on('timer', timestamp => cb(null, timestamp));
  socket.emit('subscribeToTimer', 1000);
};

class App extends Component {
  state = {
    timestamp: 'No timestamp'
  }

  constructor() {
    super();
    
    subscribeToTimer((err, timestamp) => this.setState({ 
      timestamp 
    }))
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1 className="App-title">Welcome to React</h1>
        </header>
        <p className="App-intro">
          To get started, edit <code>src/App.js</code> and save to reload.
        </p>
        <p>{this.state.timestamp}</p>
      </div>
    );
  }
}

export default App;
