
import React, { Component } from 'react';
import styled from '@emotion/styled'
import Board from '../components/Board';
import { GRID_SIZE, BORDER_WODTH, BASE_SPEED_INTERVAL, DIRECTION_RIGHT, DIRECTION_UP, DIRECTION_LEFT, DIRECTION_DOWN, KEYCODE_DOWN, KEYCODE_UP, KEYCODE_LEFT, KEYCODE_RIGHT, KEYCODE_PLUS, KEYCODE_MINUS } from '../helpers/constants';

const StyledHeader = styled('div')`
    padding: 10px;
    border: 1px solid gray;
    font-size: 18px;
    text-align: center;
    margin: 0 auto;
`;

const SNAKE_START = [[0, 0], [0, 1]];

const GAME_NEW = 0;
const GAME_STARTED = 1;
const GAME_PAUSED = 2;
const GAME_OVER = 3;

const keyDirectionMap = {
    [KEYCODE_DOWN]: DIRECTION_DOWN,
    [KEYCODE_UP]: DIRECTION_UP,
    [KEYCODE_LEFT]: DIRECTION_LEFT,
    [KEYCODE_RIGHT]: DIRECTION_RIGHT
}

const stateDisplay = (status) => {
    switch (status) {
        case GAME_NEW:
            return 'New Game';
        case GAME_OVER:
            return 'Game Over';
        case GAME_PAUSED:
            return 'Game Paused';
        default:
            return '';
    }
};

const buttonLabel = (status) => {
    switch (status) {
        case GAME_NEW:
        case GAME_PAUSED:
            return 'Start';
        case GAME_OVER:
            return 'New Game';
        case GAME_STARTED:
            return 'Pause';
        default:
            return '';
    }
}

const getNextPoint = (point, direction) => {
    switch (direction) {
        case DIRECTION_UP:
            return [point[0], (GRID_SIZE + point[1] - 1) % GRID_SIZE];

        case DIRECTION_DOWN:
            return [point[0], (GRID_SIZE + point[1] + 1) % GRID_SIZE];

        case DIRECTION_LEFT:
            return [(GRID_SIZE + point[0] - 1) % GRID_SIZE, point[1]];

        case DIRECTION_RIGHT:
            return [(GRID_SIZE + point[0] + 1) % GRID_SIZE, point[1]];

        default:
            break;
    }
};

const samePoints = (point1, point2) => {
    return (point1[0] === point2[0] && point1[1] === point2[1])
};

const getOpposite = (direction) => {
    switch (direction) {
        case DIRECTION_UP:
            return DIRECTION_DOWN;

        case DIRECTION_DOWN:
            return DIRECTION_UP;

        case DIRECTION_LEFT:
            return DIRECTION_RIGHT;

        case DIRECTION_RIGHT:
            return DIRECTION_LEFT;

        default:
            break;
    }
};

const getBestDirection = (srcPoint, tgtPoint, currentDirection) => {
    const xGap = srcPoint[0] - tgtPoint[0]; // -ve if apple is on left side
    const yGap = srcPoint[1] - tgtPoint[1]; // -ve if apple is on up side

    let direction = currentDirection;

    if (xGap === 0 || Math.abs(yGap) >= Math.abs(xGap)) {
        direction = yGap > 0 ? DIRECTION_UP : DIRECTION_DOWN;
        if (currentDirection === getOpposite(direction))
            direction = xGap > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
    }
    if (yGap === 0 || Math.abs(xGap) > Math.abs(yGap)) {
        direction = xGap > 0 ? DIRECTION_LEFT : DIRECTION_RIGHT;
        if (currentDirection === getOpposite(direction))
            direction = yGap > 0 ? DIRECTION_UP : DIRECTION_DOWN;
    }

    console.log(xGap, yGap, '==>', currentDirection, ';', direction);

    return direction;
};

const newGameState = (size = GRID_SIZE) => ({
    size: size,
    score: 0,
    speed: 1,
    status: GAME_NEW,
    snakePoints: SNAKE_START,
    direction: DIRECTION_DOWN
});

let gameInterval;

export default class Game extends Component {

    constructor(props) {
        super(props);

        this.state = newGameState(props.size);
        this.state.ai = false;
        this.state.ml = false;
        this.state.apple = this.newApplePoint();

        this.width = (this.state.size) * GRID_SIZE + 4 * BORDER_WODTH;
    }

    handleKeyDown = (event) => {
        switch (event.keyCode) {
            case KEYCODE_PLUS:
                this.setState(({speed}) => ({ speed: speed + 1 }), this.resetInterval);
                break;
            case KEYCODE_MINUS:
                this.setState(({speed}) => ({ speed: speed - 1 }), this.resetInterval);
                break;
            case KEYCODE_DOWN:
            case KEYCODE_UP:
            case KEYCODE_LEFT:
            case KEYCODE_RIGHT:
                const direction = keyDirectionMap[event.keyCode];
                if (getOpposite(this.state.direction) === direction) {
                    this.reverseSnake();
                } else {
                    this.setState({direction});
                }
                break;
            default:
                break;
        }
    }

    getTailDirection = () => {
        const tail = this.state.snakePoints[0];
        const tailNext = this.state.snakePoints[1];

        if (tail[0] === tailNext[0]) {
            return tail[1] > tailNext[1] ? DIRECTION_UP : DIRECTION_DOWN;
        } else {
            return tail[0] > tailNext[0] ? DIRECTION_LEFT : DIRECTION_RIGHT;
        }
    }

    reverseSnake = () => {
        debugger;
        const tail = this.state.snakePoints[0];
        const tailDirection = this.getTailDirection();

        this.setState(({ snakePoints }) => {
            const pointsCopy = [];
            for (let i = snakePoints.length - 1; i >= 0; i--) {
                pointsCopy[snakePoints.length - 1 - i] = snakePoints[i];
            }
            return { snakePoints: pointsCopy, direction: getOpposite(tailDirection) };
        });

        return tail;
    }

    resetInterval = () => {
        gameInterval && clearInterval(gameInterval);
        gameInterval = setInterval(this.moveSnake, BASE_SPEED_INTERVAL / this.state.speed);
    };

    newApplePoint = () => {
        const point = [Math.floor(Math.random() * GRID_SIZE), Math.floor(Math.random() * GRID_SIZE)];
        if (this.checkIfOnSnake(point)) {
            return this.newApplePoint();
        }
        return point;
    }

    checkIfOnSnake = (point) => {
        console.log('checkIfOnSnake', point);
        return this.state.snakePoints.find((eachPoint) => samePoints(eachPoint, point));
    }

    checkEnteringCave = (head, direction) => {
        const side1Direction = (direction + 1) % 4;
        const side1Point = getNextPoint(head, side1Direction);

        const side2Direction = (4 + direction - 1) % 4;
        const side2Point = getNextPoint(head, side2Direction);

        return false;
        // return (this.checkIfOnSnake(side1Point) && this.checkIfOnSnake(side2Point));
    }

    calculateDirection = (head) => {
        let direction = getBestDirection(head, this.state.apple, this.state.direction);
        let newHead;
        let trials = 0;
        while (trials < 4) {
            newHead = getNextPoint(head, direction);
            if (!this.checkIfOnSnake(newHead)) {
                if (!this.checkEnteringCave(newHead, direction))
                    break;
            }
            direction = (direction + 1) % 4;
            trials++;
        }

        if (trials === 4) {
            if (this.state.ml) {
                return this.calculateDirection(this.reverseSnake());
            }
        }
        return [direction, newHead];
    }

    moveSnake = () => {
        const head = this.state.snakePoints[this.state.snakePoints.length - 1];
        let direction = this.state.direction;
        let newHead;
        if (this.state.ai) {
            [direction, newHead] = this.calculateDirection(head);
        } else {
            newHead = getNextPoint(head, direction);
        }

        if (this.checkIfOnSnake(newHead)) {
            this.setState({ status: GAME_OVER });
            gameInterval && clearInterval(gameInterval);
        }
        if (samePoints(newHead, this.state.apple)) {
            // Eat the apple : increase size from front.
            this.setState(({ snakePoints, score }) => ({
                snakePoints: [...snakePoints, newHead],
                apple: this.newApplePoint(),
                score: score + 1,
                direction
            }));
        } else {
            // Move the snake:
            this.setState(({ snakePoints }) => {
                const pointsCopy = [];
                for (let i = snakePoints.length - 1; i > 0; i--) {
                    pointsCopy[i - 1] = snakePoints[i];
                }
                pointsCopy[snakePoints.length - 1] = newHead;
                return { snakePoints: pointsCopy, direction };
            });
        }
    };

    onAction = () => {
        if (this.state.status === GAME_NEW || this.state.status === GAME_PAUSED) {
            this.setState({ status: GAME_STARTED });
            document.addEventListener("keydown", this.handleKeyDown);
            this.resetInterval();
        } else if (this.state.status === GAME_STARTED) {
            this.setState({ status: GAME_PAUSED });
            gameInterval && clearInterval(gameInterval);
        } else if (this.state.status === GAME_OVER) {
            this.setState(newGameState(this.props.size));
        }
    };

    toggleAI = () => {
        this.setState(({ai}) => ({ ai: !ai }));
    }

    toggleML = () => {
        this.setState(({ml}) => ({ ml: !ml }));
    }

    render() {
        return (
            <div style={{ width: this.width }}>
                <StyledHeader>
                    <span style={{ float: 'left' }} >Score: {this.state.score}</span>
                    <span style={{ float: 'left', marginLeft: '10px' }} >Speed: {this.state.speed}</span>
                    <div style={{ display: "inline-block" }}> {stateDisplay(this.state.status)} </div>
                    <button style={{ float: 'right', marginLeft: '10px' }} onClick={this.onAction}>
                        {buttonLabel(this.state.status)}
                    </button>
                    <div style={{ float: 'right' }}><input type="checkbox" onClick={this.toggleAI} /> AI</div>
                    <div style={{ float: 'right' }}><input type="checkbox" onClick={this.toggleML} /> Can Reverse</div>
                </StyledHeader>
                <Board size={this.state.size} snakePoints={this.state.snakePoints} direction={this.state.direction} apple={this.state.apple} />
            </div>
        );
    }
}
