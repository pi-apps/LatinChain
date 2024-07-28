import { disjoint, interval, matrixInterval } from "./utils.js";

const level0 = [
    ...interval(1, 12, (x) => [x, 0, 0]),
    ...interval(3, 10, (x) => [x, 1, 0]),
    ...interval(2, 11, (x) => [x, 2, 0]),
    [0, 3.5, 0],
    ...interval(1, 12, (x) => [x, 3, 0]),
    ...interval(1, 12, (x) => [x, 4, 0]),
    [13, 3.5, 0],
    [14, 3.5, 0],
    ...interval(2, 11, (x) => [x, 5, 0]),
    ...interval(3, 10, (x) => [x, 6, 0]),
    ...interval(1, 12, (x) => [x, 7, 0]),
].reverse();

const level1 = matrixInterval(4, 9, 1, 6, (x, y) => [x, y, 1]).reverse();
const level2 = matrixInterval(5, 8, 2, 5, (x, y) => [x, y, 2]).reverse();
const level3 = matrixInterval(6, 7, 3, 4, (x, y) => [x, y, 3]).reverse();
const level4 = [[6.5, 3.5, 4]];

export const COORDINATES = [...level0, ...level1, ...level2, ...level3, ...level4];

function leftNeighbors(coord) {
    if (
        coord.toString() === [1, 3, 0].toString() ||
        coord.toString() === [1, 4, 0].toString()
    ) {
        return [[0, 3.5, 0]];
    }
    if (coord.toString() === [13, 3.5, 0].toString()) {
        return [
            [12, 3, 0],
            [12, 4, 0],
        ];
    }
    const [x, y, z] = coord;
    return [[x - 1, y, z]];
}

function rightNeighbors(coord) {
    if (coord.toString() === [0, 3.5, 0].toString()) {
        return [
            [1, 3, 0],
            [1, 4, 0],
        ];
    }
    if (
        coord.toString() === [12, 3, 0].toString() ||
        coord.toString() === [12, 4, 0].toString()
    ) {
        return [[13, 3.5, 0]];
    }
    const [x, y, z] = coord;
    return [[x + 1, y, z]];
}

export function isOpen(coord, currentCoords) {
    if (disjoint([coord], currentCoords)) return false;
    const [x, y, z] = coord;
    if (
        currentCoords.some(([a, b, c]) => a === x && b === y && c > z) ||
        (z === 3 && currentCoords.some(([a, b, c]) => c === 4))
    ) {
        return false;
    }
    return (
        disjoint(leftNeighbors(coord), currentCoords) ||
        disjoint(rightNeighbors(coord), currentCoords)
    );
}
