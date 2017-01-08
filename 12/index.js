const fs = require('fs');
const assembunny = require('./assembunny');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
`; // a: 42

// part 1
console.log(assembunny.execute(input));

// part 2
console.log(assembunny.execute(input, { position: 0, a: 0, b: 0, c: 1, d: 0 }));
