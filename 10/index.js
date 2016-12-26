const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
value 5 goes to bot 2
bot 2 gives low to bot 1 and high to bot 0
value 3 goes to bot 1
bot 1 gives low to output 1 and high to bot 0
bot 0 gives low to output 2 and high to output 0
value 2 goes to bot 2
`;

/* In the end, output bin 0 contains a value-5 microchip, output bin 1 contains
a value-2 microchip, and output bin 2 contains a value-3 microchip. In this
configuration, bot number 2 is responsible for comparing value-5 microchips with
value-2 microchips. */

function parseInstructions(input) {
  return input.trim().split('\n').map(line => {
    const parts = line.split(' ');

    if (parts[0] === 'value') {
      return {
        from: 'input',
        to: `bot${parts[5]}`,
        value: Number(parts[1])
      }
    }

    if (parts[0] === 'bot') {
      return {
        from: `bot${parts[1]}`,
        actions: [
          { value: parts[3], to: `${parts[5]}${parts[6]}` },
          { value: parts[8], to: `${parts[10]}${parts[11]}` }
        ]
      }
    }
  });
}

function getInitialState(instructions) {
  const state = { instructions: [] };

  instructions.forEach(instr => {
    if (instr.from === 'input') {
      state[instr.to] = state[instr.to] || [];
      state[instr.to].push(instr.value);
    } else {
      state.instructions.push(instr);
    }
  });

  return state;
}

function step(state) {
  const newState = Object.assign({}, state);

  const bot = Object.keys(state)
    .filter(key => key !== 'instructions')
    .find(bot => state[bot].length > 1);

  const microchips = state[bot];

  if (microchips.some(val => val === 17) && microchips.some(val => val === 61)) {
    console.log(bot);
  }

  const instr = state.instructions.find(instr => instr.from === bot);

  instr.actions.forEach(action => {
    const value = action.value === 'low' ?
      Math.min(microchips[0], microchips[1])
      :
      Math.max(microchips[0], microchips[1]);

    newState[action.to] = newState[action.to] || [];
    newState[action.to].push(value);
  });

  newState.instructions = newState.instructions.filter(instr => instr.from !== bot);
  delete newState[bot];

  return newState;
}

function execute(instructions) {
  const initialState = getInitialState(instructions);
  let finalState = initialState;

  while (finalState.instructions.length > 0) {
    finalState = step(finalState);
  }

  return finalState;
}

const instructions = parseInstructions(input);
const finalState = execute(instructions);

console.log(finalState);

console.log(finalState.output0 * finalState.output1 * finalState.output2);
