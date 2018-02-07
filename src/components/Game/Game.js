import React, { Component } from 'react';
import './Game.css';

import { socket, onEnemyStep, onGameOver } from '../../api';

class Game extends Component {
    constructor(props) {
        super(props);

        onEnemyStep(({cellIndex}) => {
            console.log(`Enemy stepped: ${cellIndex}`);
            this.updateGrid(cellIndex, true);
            this.setState(({
                isStepLocked: false
            }))
        })

        onGameOver(({ result, lastMove}) => {
            const me = this.props.isFirst ? 'Creator' : 'JoinedUser';
            const isTie = result === 'Tie';
            const isWinner = isTie ? false : me === result ? true : false

            console.log(`Me: ${me}. result === Tie: ${isTie}. isWinner: ${isWinner}`);

            this.updateGrid(lastMove, true);
            this.setState({
                isGameOver: true,
                isTie,
                isWinner
            });
        })

        this.state = {
            grid: [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ],
            isStepLocked: props.isFirst ? false : true,
            isGameOver: false
        }
    }

    componentWillReceiveProps(nextProp) {
        if(nextProp.isFirst !== this.props.isFirst) {
            this.setState(({
                isStepLocked: nextProp.isFirst ? false : true,
            }));
        }
    }

    handleStep = (cellIndex) => {
        const mark = this.props.isFirst ? 'X' : 'O';
        const { isStepLocked } = this.state;

        if(!isStepLocked && this.isNotAlreadyMarked(cellIndex)) {
            console.log(`Steping: ${cellIndex}`);

            socket.emit('step', { cellIndex, isCreator: this.props.isFirst }, () => {
                console.log(`Indeed Steped: ${cellIndex}`)
            });

            this.updateGrid(cellIndex, false);

            this.setState(({
                isStepLocked: true
            }))
        }
    }

    isNotAlreadyMarked = (cellIndex) => {
        return this.state.grid[cellIndex] === 0;
    }

    updateGrid = (cellIndex, isEnemy) => {
        const { grid } = this.state;
        let updatedGrid = grid.slice();

        updatedGrid[cellIndex] = isEnemy ? -1 : 1;

        this.setState((state) => ({
            grid: updatedGrid
        }));
    }

    render() {
        const { grid, isGameOver, isWinner, isTie } = this.state;
        const mark = this.props.isFirst ? 'X' : 'O';
        const enemyMark = mark === 'X' ? 'O' : 'X';
        const blank = '';

        return (
            !isGameOver ? (
                <div className="game">
                {
                    grid.map((cell, index) => {
                        return (
                            <div key={index} className="cell" onClick={() => this.handleStep(index)}>
                                <span className="cell-text">
                                    { cell === 1 ? mark : cell === -1 ? enemyMark : blank }
                                </span>
                            </div>
                        )
                    })
                }
                </div>
            ) : (
                <div>
                    <p>{ isTie ? 'Draw' : isWinner ? 'You won' : 'You lost' }</p>
                </div>
            )
        );
    }
}

export default Game;