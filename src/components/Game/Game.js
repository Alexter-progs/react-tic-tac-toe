import React, { Component } from 'react';
import './Game.css';

import { socket } from '../../api';

class Game extends Component {
  render() {
    const { className: gameClassName } = this.props;
    return (
      <div className="game">
        YO
      </div>
    );
  }
}

export default Game;