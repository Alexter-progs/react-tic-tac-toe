import React, { Component } from 'react';
import './App.css';
import openSocket from 'socket.io-client';

const socket = openSocket(process.env.REACT_APP_HOST_URL);
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
      <div>
        Hello
      </div>
    );
  }
}

export default App;
