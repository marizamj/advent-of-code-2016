const fs = require('fs');

const aStar = require('a-star');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
###########
#0.1.....2#
#.#######.#
#4.......3#
###########
`;  // shortest path - 14 steps

const parse = input => input.trim().split('\n').map(line => line.trim().split(''));

const getState = grid => {
  const checkpoints = grid.reduce((result, line, y) =>
    result.concat(line.reduce((lineResult, cell, x) =>
      cell !== '#' && cell !== '.' ?
        lineResult.concat({ x, y, visited: false }) : lineResult, [])), []);

  const start = checkpoints.shift();
  const end = Object.assign({}, start);
  return { start, checkpoints, end };
};

const isEnd = state => heuristic(state) === 0;

const distance = (a, b) => 1;

const heuristic = state =>
  state.checkpoints.reduce((result, point) => !point.visited ? result + 1 : result, 0)
  + Math.abs(state.start.x - state.end.x) + Math.abs(state.start.y - state.end.y);

const go = (state, start) => {
  const end = state.end;
  const checkpoints = state.checkpoints.map(point => {
    if (point.x === start.x && point.y === start.y) {
      return Object.assign({}, point, { visited: true } );
    }
    return point;
  });

  return { start, checkpoints, end };
};

const neighbor = state => {
  const currX = state.start.x;
  const currY = state.start.y;

  return grid.reduce((result, line, y) =>
    result.concat(line.reduce((lineResult, cell, x) =>
      Math.abs((currX - x)) + Math.abs((currY - y)) === 1 && cell !== '#' ?
        lineResult.concat(go(state, { x, y })) : lineResult, [])), []);
};

const hash = state => `${state.start.x}|${state.start.y}c${
  state.checkpoints.map(point =>
    `${point.x}|${point.y}${point.visited ? 'Y' : 'N'}`).join('')
}`;

const grid = parse(input);

const start = getState(grid);

const path = aStar({ start, isEnd, neighbor, distance, heuristic, hash });

console.log(path.status, path.cost);
