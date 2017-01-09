const fs = require('fs');
const assert = require('assert');
const assembunny = require('../12/assembunny');

const input = fs.readFileSync(__dirname + '/input.txt', 'utf8');

const testMul = `
  cpy 11 c
  cpy 0 d
  cpy 231 b
  inc d
  dec b
  jnz b -2
  dec c
  jnz c -5
`;

const testDiv = `
  cpy d b
  cpy 0 a
  cpy 2 c
  jnz b 2
  jnz 1 6
  dec b
  dec c
  jnz c -4
  inc a
  jnz 1 -7
`;

const testSub = `
  cpy 100 b
  jnz c 2
  jnz 1 4
  dec b
  dec c
  jnz 1 -4
`;

const buildComplexTest = (...tests) => tests.map(test => test.trim()).join('\njnz 0 0\n');

const testComplex1 = buildComplexTest(testSub, testDiv);

const testComplex2 = buildComplexTest(testDiv, testMul, testDiv);

const testComplex3 = buildComplexTest(
  testMul,
  testMul,
  testDiv,
  testDiv,
  testSub,
  testSub
);

const runOne = (init) => {
  const { output, endState } = assembunny.execute(input, {
    state: { position: 0, a: init, b: 0, c: 0, d: 0 },
    // shouldOptimize: false,
    jumpLimit: 7000,
  });
  console.log(init, output, endState);
}

const run = () => {
  for (let i = 0; i < 100; i++) {
    runOne(i);
  }
}

const checkOptimization = (test, state) =>
  assert.deepEqual(
    assembunny.execute(test, {
      state: Object.assign({}, state),
      shouldOptimize: false,
    }),
    assembunny.execute(test, {
      state: Object.assign({}, state),
    })
  );

// checkOptimization(testComplex1, { position: 0, a: 1, b: 2, c: 3, d: 4 });

// checkOptimization(testComplex2, { position: 0, a: 1, b: 2, c: 3, d: 4 });

// checkOptimization(testComplex3, { position: 0, a: 1, b: 2, c: 3, d: 5 });

// checkOptimization(testMul, { position: 0, a: 1, b: 2, c: 3, d: 5 });

// checkOptimization(testDiv, { position: 0, a: 1, b: 2, c: 3, d: 4 });

// checkOptimization(testSub, { position: 0, a: 1, b: 2, c: 10, d: 3 });

// const jnzTest = `
// jnz 0 0
// jnz 0 0
// jnz 0 0
// jnz 0 0
// jnz 0 0
// `;

// checkOptimization(jnzTest, { position: 0, a: 1, b: 2, c: 10, d: 3 });

run();

// runOne(420);
