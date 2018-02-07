import React, { Component } from 'react';
import './Chat.css';

import { onChatMessage, socket } from '../../api'

// Generates messages id for key prop, 
// otherwise animations won't work because 
// react is not updating elements
import uuid from 'uuid';

class Chat extends Component {
  state = {
    message: '',
    messages: []
  }

  constructor() {
    super();

    onChatMessage((message) => {
      console.log(`Received message: ${message}`)
      this.updateMessages({ text: message, user: 'Oponent', id: uuid.v4() });
    })
  }

  messageChange = (event) => {
    const message = event.target.value;

    this.setState(() => ({
      message
    }))
  }

  handleKeyPress = (event) => {
    if(event.key === 'Enter') {
      this.messageSubmit();
    }
  }

  messageSubmit = () => {
    const { message } = this.state;

    if(message.length > 0) {
      this.updateMessages({ text: message, user: 'Me', id: uuid.v4() });
      socket.emit('broadcastMessage', message);
    }
  }

  updateMessages = (message) => {
    const { messages } = this.state;

    let updatedMessages = messages.slice();
    updatedMessages.push(message);

    this.pop(updatedMessages);

    this.setState(() => ({
      messages: updatedMessages,
      message: ''
    }));
  }

  // Faking queue
  pop = (arr) => {
    const MAX_MESSAGE_COUNT = 21;

    if(arr.length > MAX_MESSAGE_COUNT) {
      arr.reverse();
      arr.pop();
      arr.reverse();
    }
  }

  render() {
    const { messages } = this.state;
    

    return (
      <div className="chat">
        <div className="chat-messages">
          {messages.map((message, index) => (
            <span key={message.id}>
              <p>{message.user}: {message.text}</p>
            </span>
          ))}
        </div>
        <div className="chat-input">
          <div className="message-input-wrapper">
            <input type="text" placeholder="Enter your message"
              value={this.state.message} 
              onChange={this.messageChange}
              onKeyPress={this.handleKeyPress}
            />
          </div>
          <input type="button" className="chat-send" value="Send" onClick={this.messageSubmit}/>
        </div>
      </div>
    );
  }
}

export default Chat;