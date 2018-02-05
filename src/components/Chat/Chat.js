import React, { Component } from 'react';
import './Chat.css';

class Chat extends Component {
  state = {
    message: '',
    messages: []
  }

  constructor() {
    super();
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
    const { message, messages } = this.state;
  
    if(message.length > 0) { 
      let updatedMessages = messages.slice();
      updatedMessages.push(message);

      this.reverse(updatedMessages);
  
      this.setState(() => ({
        messages: updatedMessages,
        message: ''
      }));
    }
  }

  reverse = (arr) => {
    if(arr.length > 10) {
      arr.reverse();
      arr.pop();
      arr.reverse();
    }
  }

  render() {
    const { className: chatClassName } = this.props;
    const { messages } = this.state;

    return (
      <div className={chatClassName}>
        <div className="chat-messages">
          {messages.map((message, index) => (
            <span key={index}>
              <p>{message}</p>
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