import { BOX_SIZE, PADDING, DIRECTION_UP, DIRECTION_LEFT, DIRECTION_RIGHT, BORDER_WODTH, DIRECTION_DOWN } from "../helpers/constants";
import styled from "@emotion/styled";

const TOP_PADDING = 63;

const commonStyle = (position, color) => `
    padding: 0px;
    position: absolute;
    margin: 1px;
    display: inline-block;
    transition: 'all 0.1s ease';
    top: ${(TOP_PADDING + position[1] * BOX_SIZE) + 'px'};
    left: ${(PADDING + position[0] * BOX_SIZE) + 'px'};
    background-color: ${color};
`;

const boxDirection = (direction) => {
    switch (direction) {
        case DIRECTION_UP:
        case DIRECTION_DOWN:
            return `border-left: 1px solid black; border-right: 1px solid black;`;
        case DIRECTION_LEFT:
        case DIRECTION_RIGHT:
            return `border-top: 1px solid black; border-bottom: 1px solid black;`;
        default:
            return '';
    }
}

export const Box = styled('div')`
    ${({position, color}) => commonStyle(position, color)}
    
    width: ${BOX_SIZE - 2 + 'px'};
    height: ${BOX_SIZE - 2 + 'px'};
    border-radius: 3px;
    ${({direction}) => boxDirection(direction)}
`;

export const Circle = styled('div')`
    ${({position, color}) => commonStyle(position, color)}
    
    width: ${BOX_SIZE - 2 + 'px'};
    height: ${BOX_SIZE - 2 + 'px'};
    border-radius: ${(BOX_SIZE - 2) + 'px'};
`;

const triangleStyle = (direction, color) => {
    let border1 = 'border-left';
    let border2 = 'border-right';
    let border3 = 'border-top';
    switch (direction) {
        case DIRECTION_UP:
            border3 = 'border-bottom';
            break;
        case DIRECTION_LEFT:
            border1 = 'border-top';
            border2 = 'border-bottom';
            border3 = 'border-right';
            break;
        case DIRECTION_RIGHT:
            border1 = 'border-top';
            border2 = 'border-bottom';
            border3 = 'border-left';
            break;
        default:
            break;
    }

    return `
    ${border1}: ${Math.floor(BOX_SIZE / 2)}px solid transparent;
    ${border2}: ${Math.floor(BOX_SIZE / 2)}px solid transparent;
    ${border3}: ${(BOX_SIZE - BORDER_WODTH) + 'px solid ' + color};
    `
};

export const Triangle = styled('div')`
    ${({position}) => commonStyle(position)}

    width: 0;
    height: 0;
    ${({direction, color}) => triangleStyle(direction, color)}
`;