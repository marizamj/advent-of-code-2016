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
const output1 = assembunny.execute(input, { shouldOptimize: false });

console.log(output1.a);
assert.equal(output1.a, 318003);

// part 2
const output2 = assembunny.execute(input, {
  state: { position: 0, a: 0, b: 0, c: 1, d: 0 },
  shouldOptimize: false
});

console.log(output2.a);
assert.equal(output2.a, 9227657);
