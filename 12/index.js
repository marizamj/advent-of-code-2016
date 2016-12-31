const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
cpy 41 a
inc a
inc a
dec a
jnz a 2
dec a
`;

const parseCommands = input =>
  input.trim().split('\n').map(line => {
    const parts = line.split(' ');
    const action = parts.shift();
    return { action, args: parts }
  });

const commands = {
  cpy: (args, state) => {
    if (state[args[0]]) {
      state[args[1]] = state[args[0]];
    } else {
      state[args[1]] = args[0];
    }

    state.position++;
  },

  inc: (args, state) => {
    state[args[0]] = state[args[0]] || 0;
    state[args[0]]++;
    state.position++;
  },

  dec: (args, state) => {
    state[args[0]] = state[args[0]] || 0;
    state[args[0]]--;
    state.position++;
  },

  jnz: (args, state) => {
    if (!isNaN(args[0]) && args[0] !== 0) {
      state.position += Number(args[1]);

    } else {
      state[args[0]] = state[args[0]] || 0;

      if (state[args[0]] !== 0) {
        state.position += Number(args[1]);
      } else {
        state.position++;
      }
    }
  }
};

const execute = commandList => {
  let state = { position: 0, c: 1 };

  while (state.position < commandList.length) {
    const { action, args } = commandList[state.position];

    commands[action](args, state);
  }

  return state;
}

const commandList = parseCommands(input);
const endState = execute(commandList);

console.log(endState);






