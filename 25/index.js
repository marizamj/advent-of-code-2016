const fs = require('fs');

const assembunny = require('../12/assembunny');

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const output1 = assembunny.execute(input, {
  state: { position: 0, a: 0, b: 0, c: 0, d: 0 },
});

console.log(output1);
