import React, { Component } from 'react';
import Chat from './components/Chat/Chat';
import './App.css';
import openSocket from 'socket.io-client';

const socket = openSocket(process.env.REACT_APP_HOST_URL);

class App extends Component {
  state = {
    timestamp: 'No timestamp'
  }

  constructor() {
    super();
  }

  render() {
    return (
      <div className="app-grid">
        <Chat className="chat"/>
        <div className="game">Game</div>
      </div>
    );
  }
}

export default App;
