const fs = require('fs');
const assert = require('assert');
const assembunny = require('../12/assembunny');

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');
const test = `
cpy 2 a
tgl a
tgl a
tgl a
cpy 1 a
dec a
dec a
`; // a: 3

// part 1
const output1 = assembunny.execute(input, {
  state: { position: 0, a: 7, b: 0, c: 0, d: 0 }
});

console.log(output1);
assert.equal(output1.a, 14065);

// part 2
const output2 = assembunny.execute(input, {
  state: { position: 0, a: 12, b: 0, c: 0, d: 0 }
});

console.log(output2);
assert.equal(output2.a, 479010625);
