const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim();

const isTrap = controlGroup => {
  const traps = [ '^^.', '.^^', '^..', '..^' ];
  return traps.includes(controlGroup);
};

const getTile = (prevRow, ind) => {
  let controlGroup = '';

  if (ind === 0) {
    controlGroup = '.' + prevRow.slice(ind, ind + 2);
  } else {
    controlGroup = prevRow.slice(ind - 1, ind + 2);
  }

  if (controlGroup.length < 3) controlGroup += '.';

  return isTrap(controlGroup) ? '^' : '.';
};

const generateRow = prevRow => {
  const arr = prevRow.split('');
  return arr.map((tile, ind) => getTile(prevRow, ind)).join('');
}

const generateNRows = (firstRow, n) => {
  const grid = [ firstRow ];

  for (let i = 1; i < n; i++) {
    grid.push(generateRow(grid[i - 1]));
  }

  return grid;
}

const countSafeTiles = grid =>
  grid.reduce((result, row) =>
    result + row.split('').filter(tile => tile === '.').length, 0);

const processAll = (input, rows) => {
  const grid = generateNRows(input, rows);
  return countSafeTiles(grid);
}

console.log(processAll(input, 400000));
