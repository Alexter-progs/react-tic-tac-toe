import React, { Component } from 'react';
import './Game.css';

import { socket, onEnemyStep } from '../../api';

class Cell extends Component {
    state = {
        mark: ''
    }

    handleStep = () => {
        const { x, y } = this.props;

        socket.emit('step', { x, y }, () => {
            this.setState({
                mark: 'X'
            });
        });
    }

    

    render() {
        const { x, y } = this.props;
        const { mark } = this.state;

        return (
            <div className="cell" onClick={this.handleStep}>
                <span className="cell-text">
                    { mark }
                </span>
            </div>
        )
    }
}

const Grid = () => {
    let grid = [
        [0, 0, 0],
        [0, 0, 0],
        [0, 0, 0]
    ]

    return grid.map((row, rowIndex) => {
        return row.map((cell, columnIndex) => {
            return <Cell key={rowIndex + columnIndex} x={rowIndex} y={columnIndex}/>
        })  
    }); 
}

class Game extends Component {
    constructor() {
        super();

        onEnemyStep(({ x, y }) => {
            console.log(`x: ${x}, y: ${y}`);
        })
    }

    render() {
        const { className: gameClassName, isFirst } = this.props;
        const mark = isFirst ? 'X' : 'O';

        return (
        <div className="game">
            <Grid/>
        </div>
        );
    }
}

export default Game;