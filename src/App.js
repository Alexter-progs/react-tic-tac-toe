import React, { Component } from 'react';
import Chat from './components/Chat/Chat';
import './App.css';
import uuid from 'uuid';

import { getRoomFromUrl } from './utils/index'
import { joinRoom, onPlayerJoined } from './api';

class App extends Component {
  constructor() {
    super();
    this.state = {
      joinedRoom: getRoomFromUrl().length !== 0 ? true : false,
      connectionURL: `${process.env.REACT_APP_HOST_URL}${process.env.REACT_APP_DEV_SERVER_PORT}/chat/${uuid.v4()}`
    }
  }

  state = {
    joinedRoom: false
  }

  componentWillMount() {
    joinRoom((roomId) => {
      console.log(roomId);
      if(roomId === 'error') {
        this.setState({
          joinedRoom: false
        })
      } else {
        console.log(`I joined the room #${roomId}`);
      }
      
    });

    onPlayerJoined(() => {
      console.log('Player joined');
    })
  }

  render() {
    const { joinedRoom, connectionURL } = this.state;

    return (
      joinedRoom ? (
        <div className="app-grid">
          <Chat className="chat"/>
          <div className="game">Game</div>
        </div>
      ) : (
        <div>Give this URL to your friend to play toogether: <a href={connectionURL}>{connectionURL}</a></div>
      )
    );
  }
}

export default App;
