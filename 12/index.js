const fs = require('fs');
const assert = require('assert');
const assembunny = require('./assembunny');

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');
const test = `
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
`; // a: 42

// part 1
const result1 = assembunny.execute(input, { shouldOptimize: false });

console.log(result1.endState.a);
assert.equal(result1.endState.a, 318003);

// part 2
const result2 = assembunny.execute(input, {
  state: { position: 0, a: 0, b: 0, c: 1, d: 0 },
  shouldOptimize: false
});

console.log(result2.endState.a);
assert.equal(result2.endState.a, 9227657);
