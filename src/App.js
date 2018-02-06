import React, { Component } from 'react';
import Chat from './components/Chat/Chat';
import './App.css';
import uuid from 'uuid';

import { getRoomFromUrl } from './utils/index'
import { socket, onPlayerJoined } from './api';

const HOST_URL = process.env.REACT_APP_HOST_URL + process.env.REACT_APP_DEV_SERVER_PORT

class App extends Component {
  constructor() {
    super();

    let roomId = getRoomFromUrl();
    const shouldJoinRoom = roomId.length !== 0 ? true : false;

    roomId = shouldJoinRoom ? roomId : uuid.v4();

    this.state = {
      shouldJoinRoom,
      connectionURL: `${HOST_URL}/chat/${roomId}`,
      roomId
    }
  }

  state = {
    shouldJoinRoom: false,
    connectionURL: null,
    roomId: null
  }

  componentWillMount() {
    const { roomId } = this.state;

    socket.emit('join', roomId, (roomId) => {
      console.log(roomId);
      if(roomId === 'error') {
        const newRoomId = uuid.v4();

        this.setState({
          shouldJoinRoom: false,
          connectionURL: `${HOST_URL}/chat/${newRoomId}`,
          roomId: newRoomId
        })
      } else {
        console.log(`I joined the room #${roomId}`);
      }
      
    });

    onPlayerJoined(() => {
      console.log('Second player is joined');

      this.setState({
        shouldJoinRoom: true
      })
    })
  }

  render() {
    const { shouldJoinRoom, connectionURL } = this.state;

    return (
      shouldJoinRoom ? (
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
