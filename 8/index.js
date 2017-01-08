const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const parseCommands = (input) =>
  input.trim().split('\n').map(line => {
    const [ action, ...instructions ] = line.split(' ');
    return { action, instructions };
  });

const create2dMatrix = (h, w) =>
  Array.from({ length: h }).map(col =>
    Array.from({ length: w }).map(cell => '.'));

const shift = {
  row: (matrix, ind, n) =>
    matrix.map((row, ri) => {
      if (ri === ind) {
        return row.reduce((newRow, cell, i) => {
          newRow[(i + n) % row.length] = cell;
          return newRow;

        }, Array.from({ length: row.length }));
      } else return row;
    }),

  column: (matrix, ind, n) =>
    matrix.map((row, ri) =>
      row.map((cell, ci) => {
        if (ci === ind) {
          return matrix[ri - n] ?
            matrix[ri - n][ci]
            :
            matrix[(ri - n) + matrix.length][ci];
        } else return cell;
    }))
};

const manual = {
  rect: (matrix, instructions) => {
    const [ width, height ] = instructions[0].split('x');

    return matrix.map((row, y) => row.map((cell, x) =>
      y < height && x < width ? '#' : cell ))
  },

  rotate: (matrix, instructions) => {
    const coord = instructions[0];
    const index = Number(instructions[1].split('=')[1]);
    const turns = Number(instructions[3]);

    return instructions[0] === 'row' ?
      shift.row(matrix, index, turns)
      :
      shift.column(matrix, index, turns);
  }
};

const execute = (matrix, commands) =>
  commands.reduce((newMatrix, command) =>
    manual[command.action](newMatrix, command.instructions), matrix.concat());

const countLights = (matrix) =>
  matrix.reduce((result, row) =>
    result + row.reduce((res, cell) =>
      cell === '#' ? res + 1 : res, 0), 0);

const screen = create2dMatrix(6, 50);

const commands = parseCommands(input);

const executed = execute(screen, commands);

const result = countLights(executed);

console.log(executed.map(line => line.join('')));
