const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const regex = /\/dev\/grid\/node-x(\d+)-y(\d+)\s+(\d+)T\s+(\d+)T\s+(\d+)T\s+(\d+)%/;

const n = str => Number(str);

const parseInput = input =>
  input.trim().split('\n').map(line => {
    const [ _, x, y, size, used, avail, useP ] = line.match(regex) ?
      line.match(regex).map(el => n(el)) : [];
    return { x, y, size, used, avail, useP };
  }).filter(el => el.x !== undefined);

const getConnections = (node, nodes) =>
  nodes.filter(el =>
    (el.x - node.x === 1 && el.y === node.y) ||
    (node.x - el.x === 1 && el.y === node.y) ||
    (el.y - node.y === 1 && el.x === node.x) ||
    (node.y - el.y === 1 && el.x === node.x)
  );

const isViable = (a, b) =>
  (a.x !== b.x || a.y !== b.y) && a.used > 0 && a.used <= b.avail;

const viablePairs = input =>
  parseInput(input).reduce((res, node, i, nodes) =>
    res + nodes.reduce((sum, el) =>
      isViable(el, node) ? sum + 1 : sum, 0), 0);

const grid = input =>
  parseInput(input).reduce((grid, node) => {
    grid[node.y] = grid[node.y] || [];
    grid[node.y][node.x] = node.used > 100 ? '##' : `${node.used}`;
    return grid;
  }, []);

const drawGrid = input => {
  console.log(grid(input).map(line => line.join(' ')).join('\n'));
};

console.log(grid(input)[0].length, grid(input).length);
// console.log(viablePairs(input));
