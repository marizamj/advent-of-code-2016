const masks = require(__dirname + '/assembunny_masks');

const nip = n => isNaN(Number(n)) ? n : Number(n);

const zip = ([a0, ...aRest], [b0, ...bRest]) =>
  a0 && b0 ? [[a0, b0], ...zip(aRest, bRest)] : [];

const toggle = { inc: 'dec', dec: 'inc', tgl: 'inc', cpy: 'jnz', jnz: 'cpy' };

const parse = input =>
  input.trim().split('\n').map(line => {
    const [ action, x, y ] = line.trim().split(' ');
    return { action, x: nip(x), y: nip(y) };
  });

const stateOrValue = (state, x) => state[x] !== undefined ? state[x] : x;

const commands = {
  cpy: (output, commandList, state, x, y) => {
    if (isNaN(y) && isNaN(x)) state[y] = state[x];
    if (isNaN(y) && !isNaN(x)) state[y] = x;
    state.position++;
  },

  inc: (output, commandList, state, x) => {
    state[x]++;
    state.position++;
  },

  dec: (output, commandList, state, x) => {
    state[x]--;
    state.position++;
  },

  jnz: (output, commandList, state, x, y) => {
    x = stateOrValue(state, x);
    y = stateOrValue(state, y);

    // console.log('!' + x);

    if (x !== 0) state.position += y;
    else state.position++;

    // if (!isNaN(x) && x !== 0) {
    //   state.position += (state[y] || y);

    // } else {

    //   if (state[x] !== 0) state.position += (state[y] || y);
    //   else state.position++;
    // }
  },

  tgl: (output, commandList, state, x) => {
    const n = stateOrValue(state, x);
    const target = commandList[state.position + n];
    if (target) target.action = toggle[target.action];
    state.position++;
  },

  out: (output, commandList, state, x) => {
    // console.log(state[x]);
    output.push(state[x]);
    state.position++;
  },

  sub: (state, dest, [ minuend, subtrahendReg ]) => {
    // console.log('sub');
    minuend = stateOrValue(state, minuend);
    subtrahend = stateOrValue(state, subtrahendReg);

    state[dest] = minuend - subtrahend;
    state[subtrahendReg] = 0;

    state.position += 6;
  },

  mul: (state, dest, values, counters) => {
    // console.log('mult');
    const multipliers = values.map(el => state[el] ? state[el] : el);

    state[dest] = multipliers[0] * multipliers[1];
    state[counters[0]] = 0;
    state[counters[1]] = 0;

    state.position += 8;
  },

  div: (state, dest, [ dividend, divisor ], [ counter1, counter2 ]) => {
    // console.log('div');
    dividend = stateOrValue(state, dividend);
    divisor = stateOrValue(state, divisor);

    state[dest] = Math.floor(dividend / divisor);
    state[counter1] = 0;
    state[counter2] = (dividend / divisor % 1 !== 0) ? divisor - 1 : divisor;

    state.position += 10;
  }
};

const compare = (result, el, maskEl) => {
  if (typeof maskEl === 'number') return el === maskEl;
  if (typeof maskEl === 'string' && maskEl.startsWith('$')) {
    return result[maskEl] ? result[maskEl] === el : true;
  }
  return true;
};

const matchMask = (block, mask) =>
  zip(block, parse(mask.pattern)).reduce((result, [ command, maskExpr ]) => {
    if (result === null) return result;
    if (command.action !== maskExpr.action) return null;


    if (compare(result, command.x, maskExpr.x) && compare(result, command.y, maskExpr.y)) {
      result[maskExpr.x] = command.x;
      result[maskExpr.y] = command.y;
    } else return null;

    return result;
  }, { command: mask.command });

const isOperation = (commandList, state) => {
  const currBlock = commandList.slice(state.position, state.position + 10);
  if (currBlock.length < 6) return null;

  const match = masks.reduce((result, mask) =>
    matchMask(currBlock, mask) || result, null);

  if (match) {
    return {
      dest: match.$dest,
      values: [ match.$value1, match.$value2 ],
      counters: [ match.$counter1, match.$counter2 ],
      command: match.command
    };
  }

  return null;
};

const defaultOptions = {
  state: { position: 0, a: 0, b: 0, c: 0, d: 0 },
  shouldOptimize: true,
  jumpLimit: Infinity
};

const execute = (input, options) => {
  let { state, shouldOptimize, jumpLimit } = Object.assign({}, defaultOptions, options);

  let commandList = parse(input);
  let output = [];

  while (jumpLimit && state.position < commandList.length) {
    const operation = shouldOptimize && isOperation(commandList, state);

    if (operation) {
      const { dest, values, counters, command } = operation;
      commands[command](state, dest, values, counters);

    } else {
      const { action, x, y } = commandList[state.position];
      commands[action](output, commandList, state, x, y);
    }

    jumpLimit--;
  }

  return { output, endState: state };
};

module.exports = { commands, execute };
