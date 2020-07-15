
import React from 'react';
import { GRID_SIZE, PADDING, BORDER_WODTH, APPLE_COLOR } from '../helpers/constants';
import styled from '@emotion/styled';
import Snake from './Snake';
import { Circle } from './Shapes';

const StyledBoard = styled('div')`
    border: 1px solid gray;
    margin-top: ${PADDING + 'px'};
    width: ${({size}) => size * GRID_SIZE + BORDER_WODTH * 2 + 'px'};
    height: ${({size}) => size * GRID_SIZE + BORDER_WODTH * 2 + 'px'};
`;

const Board = ({size, snakePoints, direction, apple}) => {

    return (
        <StyledBoard size={size}>
            <Snake points={snakePoints} direction={direction}/>
            <Circle position={apple} color={APPLE_COLOR} />
        </StyledBoard>
    );

};

export default Board;