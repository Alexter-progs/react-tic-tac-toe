import React, { Component } from 'react';
import './Game.css';
import ticAudio from '../../assets/sounds/tic.wav';
import clickAudio from '../../assets/sounds/click.wav';
import winAudio from '../../assets/sounds/win.wav';
import loseAudio from '../../assets/sounds/lose.wav';

import { socket, onEnemyStep, onOponentDisconnect, onGameOver } from '../../api'; 

class Game extends Component {
    constructor(props) {
        super(props);

        onEnemyStep(({cellIndex}) => {
            console.log(`Enemy stepped: ${cellIndex}`);
            this.props.onTurnChange(true);
            this.updateGrid(cellIndex, true);
            this.setState(({
                isStepLocked: false
            }));

            let audio = new Audio(ticAudio);
            audio.play();
        })

        onGameOver(({ result, lastMove}) => {
            const me = this.props.isFirst ? 'Creator' : 'JoinedUser';
            const isTie = result === 'Tie';
            const isWinner = isTie ? false : me === result ? true : false

            this.updateGrid(lastMove, true);
            this.setState({
                isGameOver: true,
                isTie,
                isWinner
            });

            let audio = isTie ? winAudio : isWinner ? winAudio : loseAudio;
            let gameOverSound = new Audio(audio);
            gameOverSound.play();
        })

        onOponentDisconnect(() => {
            this.setState({
                isGameOver: true,
                isOponentDisconnected: true
            })
        })

        this.state = {
            grid: [
                0, 0, 0,
                0, 0, 0,
                0, 0, 0
            ],
            isStepLocked: props.isFirst ? false : true,
            isGameOver: false,
            isOponentDisconnected: false
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
        const { isStepLocked } = this.state;

        if(!isStepLocked && this.isNotAlreadyMarked(cellIndex)) {
            console.log(`Steping: ${cellIndex}`);

            socket.emit('step', { cellIndex, isCreator: this.props.isFirst }, () => {
                console.log(`Indeed Steped: ${cellIndex}`)
            });

            let audio = new Audio(clickAudio);
            audio.play();
            this.props.onTurnChange(false);
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
        const { grid, isGameOver, isWinner, isOponentDisconnected, isTie } = this.state;
        const mark = this.props.isFirst ? 'X' : 'O';
        const enemyMark = mark === 'X' ? 'O' : 'X';
        const blank = '';

        return (
            !isGameOver ? (
                <div className="game">
                    <div className="game-grid">
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
                </div>
            ) : (
                <div className="game-end">
                    { isOponentDisconnected ? (
                        <p>Your oponent disconnected</p>
                    ) : (
                        <p>{ isTie ? 'Tie' : isWinner ? 'You won' : 'You lost' }</p>
                    )}
                </div>
            )
        );
    }
}

export default Game;