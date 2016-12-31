const fs = require('fs');

const input = 1352;
const test = 10;
/*
  0123456789
0 .#.####.##
1 ..#..#...#
2 #....##...
3 ###.#.###.
4 .##..#..#.
5 ..##....#.
6 #...##.###
*/

const START = { x: 1, y: 1 };
const END = { x: 31, y: 39 };

const create2dMatrix = (h, w) =>
  Array.from({ length: h }).map(col =>
    Array.from({ length: w }).map(cell => '.'));

const count1bits = bin =>
  bin.split('').filter(el => el === '1').length;


const getMaze = (h, w, input) => {
  const matrix = create2dMatrix(h, w);

  return matrix.map((row, y) => row.map((cell, x) => {
    const n = x*x + 3*x + 2*x*y + y + y*y + input;
    const bin = n.toString(2);

    return count1bits(bin) % 2 === 0 ? cell : '#';
  }));
}

const getPossibleSteps = (maze, pos) => {
  const possibleDirections = [
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x, y: pos.y - 1 },
    { x: pos.x + 1, y: pos.y },
    { x: pos.x - 1, y: pos.y }
  ];

  return possibleDirections.filter(dir => maze[dir.y] && maze[dir.y][dir.x] === '.');
}

const findShortestPath = (maze, start, end) => {
  const findPath = (maze, start, end, count) => {
    if (start.x === end.x && start.y === end.y) {
      paths.push(count);
      return;
    }

    const isTooLong = paths.some(path => path <= count);
    if (isTooLong) return;

    const possibleSteps = getPossibleSteps(maze, start);
    const newMaze = maze.map((row, y) => row.map((cell, x) =>
      y === start.y && x === start.x ? '0' : cell));

    possibleSteps.forEach(step => {
      findPath(newMaze, step, end, count + 1);
    });
  }

  const paths = [];

  findPath(maze, start, end, 0);

  return paths.sort((a, b) => a - b)[0];
}

// part 2

const findLocationsInSteps = (steps, maze, start) => {
  const find = (steps, maze, start, count) => {
    used.push(start);

    if (count <= steps) {

      result[`x${start.x}y${start.y}`] = true;

      const possibleSteps = getPossibleSteps(maze, start);

      possibleSteps.forEach(step => {
        if (!used.find(el => el.x === step.x && el.y === step.y)) {
          find(steps, maze, step, count + 1);
        }
      });
    }
  }

  const used = [];
  const result = {};

  find(steps, maze, start, 0);

  // return result;
  return Object.keys(result).length;
}


const maze = getMaze(10, 10, input)

console.log(maze);

// console.log(findLocationsInSteps(50, maze, START));
// console.log(findShortestPath(maze, START, END));



