const fs = require('fs');

const input = 1352;

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
};

const getPossibleSteps = (maze, pos) => {
  const possibleDirections = [
    { x: pos.x, y: pos.y + 1 },
    { x: pos.x + 1, y: pos.y },
    { x: pos.x, y: pos.y - 1 },
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
  };

  const paths = [];

  findPath(maze, start, end, 0);

  return paths.sort((a, b) => a - b)[0];
};

console.log(findShortestPath(getMaze(45, 45, input), START, END));

// part 2

const getString = loc => `x${loc.x}y${loc.y}`;

const findLocations = (maze, start, steps) => {
  let locations = [ start ];
  let visited = { [getString(start)]: true };
  let i = 0;

  while (i < steps) {
    locations = locations.reduce((result, loc) => {
      return result.concat(getPossibleSteps(maze, loc).filter(el => {
        const str = getString(el);
        return !visited[str];
      }));
    }, []);

    locations.forEach(loc => {
      visited[getString(loc)] = true;
    });

    i++;
  }

  return Object.keys(visited).length;
};

const maze = getMaze(50, 50, input);

console.log(findLocations(maze, START, 50));
