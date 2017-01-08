const fs = require('fs');
const assembunny = require('../12/assembunny');

const input = fs.readFileSync('input.txt', 'utf8');
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
console.log(assembunny.execute(input, { position: 0, a: 7, b: 0, c: 0, d: 0 }));

// part 2
console.log(assembunny.execute(input, { position: 0, a: 12, b: 0, c: 0, d: 0 }));
