import React, { Component } from 'react';
import './Chat.css';

import { onChatMessage, socket } from '../../api'

class Chat extends Component {
  state = {
    message: '',
    messages: []
  }

  constructor() {
    super();

    onChatMessage((message) => {
      console.log(`Received message: ${message}`)
      this.updateMessages({ text: message, user: 'Oponent' });
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
      this.updateMessages({ text: message, user: 'Me' });
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

  pop = (arr) => {
    if(arr.length > 10) {
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
            <span key={index}>
              <p>{message.user}: {message.text}</p>
            </span>
          ))}
        </div>
        <div className="chat-input">
          <div className="message-wrapper">
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