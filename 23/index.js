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
const result1 = assembunny.execute(input, {
  state: { position: 0, a: 7, b: 0, c: 0, d: 0 }
});

console.log(result1.endState.a);
assert.equal(result1.endState.a, 14065);

// part 2
const result2 = assembunny.execute(input, {
  state: { position: 0, a: 12, b: 0, c: 0, d: 0 }
});

console.log(result2.endState.a);
assert.equal(result2.endState.a, 479010625);
