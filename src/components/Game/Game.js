import React, { Component } from 'react';
import './Game.css';

import { socket, onEnemyStep } from '../../api';

class Game extends Component {
    constructor(props) {
        super(props);

        onEnemyStep(({ x, y }) => {
            console.log(`Enemy stepped: ${x}, ${y}`);
            this.updateGrid(x, y, true);
            this.setState(({
                isStepLocked: false
            }))
        })

        console.log(props);

        this.state = {
            grid: [
                [0, 0, 0],
                [0, 0, 0],
                [0, 0, 0]
            ],
            isStepLocked: props.isFirst ? false : true
        }
    }

    componentWillReceiveProps(nextProp) {
        if(nextProp.isFirst !== this.props.isFirst) {
            this.setState(({
                isStepLocked: nextProp.isFirst ? false : true
            }));
        }
    }

    handleStep = (x,y) => {
        const mark = this.props.isFirst ? 'X' : 'O';
        const { isStepLocked } = this.state;
        console.log(isStepLocked);
        if(!isStepLocked) {
            socket.emit('step', { x, y }, () => {
                console.log(`Steping: ${x}, ${y}`)
            });

            this.updateGrid(x, y, false);

            this.setState(({
                isStepLocked: true
            }))
        }
    }

    updateGrid = (x, y, isEnemy) => {
        const { grid } = this.state;
        let updatedGrid = grid.slice();
        let nestedArr = updatedGrid[x].slice();

        nestedArr[y] = isEnemy ? -1 : 1;
        updatedGrid[x] = nestedArr;

        console.log(updatedGrid);

        this.setState((state) => ({
            grid: updatedGrid
        }));
    }

    render() {
        const { grid } = this.state;
        const mark = this.props.isFirst ? 'X' : 'O';
        const enemyMark = mark === 'X' ? 'O' : 'X';
        const blank = '';

        console.log(grid);

        return (
            <div className="game">
                {
                    grid.map((row, rowIndex) => {
                        return row.map((cell, cellIndex) => {
                            return (
                                <div key={rowIndex + cellIndex} className="cell" onClick={() => this.handleStep(rowIndex, cellIndex)}>
                                    <span className="cell-text">
                                        { cell === 1 ? mark : cell === -1 ? enemyMark : blank }
                                    </span>
                                </div>
                            )
                        })
                    })
                }
            </div>
        );
    }
}

export default Game;