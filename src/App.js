import React, { Component } from 'react';
import Chat from './components/Chat/Chat';
import Game from './components/Game/Game';
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
      roomId,
      isFirst: false
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

    // Emitting more to fill out socket.io buffer, otherwise it stalls for few seconds
    setInterval(() => {
      socket.emit('bla', 'lo');
    }, 500);

    onPlayerJoined(() => {
      console.log('Second player is joined');

      this.setState({
        shouldJoinRoom: true,
        isFirst: true
      })
    })


  }

  render() {
    const { shouldJoinRoom, connectionURL, isFirst } = this.state;

    return (
      shouldJoinRoom ? (
        <div className="app-grid">
          <Chat/>
          <div class="cross">
            <div>Score: 1</div>
          </div>
          <Game isFirst={isFirst}/>
          <div class="zero">
            <div>Score: 2</div>
          </div>
        </div>
      ) : (
        <div>Give this URL to your friend to play toogether: <a href={connectionURL}>{connectionURL}</a></div>
      )
    );
  }
}

export default App;
