
import React from 'react';
import { SNAKE_COLOR, SNAKE_HEAD_COLOR, SNAKE_TAIL_COLOR, DIRECTION_DOWN, DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT } from '../helpers/constants';
import { Box, Triangle } from './Shapes';

const getDirection = (direction) => {
    switch (direction) {
        case DIRECTION_UP: 
            return "↑";
        case DIRECTION_DOWN: 
            return "↓";
        case DIRECTION_LEFT: 
            return '←'
        case DIRECTION_RIGHT: 
            return '→'
        default:
            return '';
    }
}

const Snake = ({points, direction}) => {

    const snakeColor = (index) => {
        if (index === points.length - 1) 
            return SNAKE_HEAD_COLOR;
        else if (index === 0)
            return SNAKE_TAIL_COLOR;
        return SNAKE_COLOR;
    }
    return (
        <div style={{margin: 0, padding: 0}}>
            {points.map((eachPoint, index) => {
                if (index === points.length - 1) 
                    return <Triangle key={index} position={eachPoint} direction={direction} color={snakeColor(index)} />

                const nextPoint = points[index+1];
                let pointDirection;
                if (eachPoint[0] === nextPoint[0]) {
                    pointDirection = eachPoint[1] > nextPoint[1] ? DIRECTION_UP : DIRECTION_DOWN;
                } else {
                    pointDirection = eachPoint[0] > nextPoint[0] ? DIRECTION_LEFT : DIRECTION_RIGHT;
                }
                return <Box key={index} position={eachPoint} color={snakeColor(index)} >
                        {getDirection(pointDirection)}
                    </Box>
            }
            )}
        </div>
    );

};

export default Snake;