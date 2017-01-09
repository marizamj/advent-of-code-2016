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
  cpy: (state, args) => {
    state.set(args.y, args.x);
    state.add('position', 1);
  },

  inc: (state, args) => {
    state.add(args.x, 1);
    state.add('position', 1);
  },

  dec: (state, args) => {
    state.add(args.x, -1);
    state.add('position', 1);
  },

  jnz: (state, args) => {
    x = state.get(args.x);
    if (x !== 0) state.add('position', args.y);
    else state.add('position', 1);
  },

  tgl: (state, args) => {
    x = state.get(args.x);
    state.tgl(state.get('position') + x);
    state.add('position', 1);
  },

  out: (state, args) => {
    state.out(args.x);
    state.add('position', 1);
  },

  sub: (state, args) => {
    const { $value1, $value2, $dest } = args;
    const value1 = state.get($value1);
    const value2 = state.get($value2);

    state.set($dest, value1 - value2);
    state.set($value2, 0);
    state.add('position', 6);
  },

  mul: (state, args) => {
    const { $value1, $value2, $init, $counter1, $counter2, $dest } = args;
    const value1 = state.get($value1);
    const value2 = state.get($value2);
    const init = state.get($init);

    state.set($dest, init + value1 * value2);
    state.set($counter1, 0);
    state.set($counter2, 0);
    state.add('position', 8);
  },

  div: (state, args) => {
    const { $value1, $value2, $counter1, $counter2, $dest } = args;

    const value1 = state.get($value1);
    const value2 = state.get($value2);

    state.set($dest, Math.floor(value1 / value2));
    state.set($counter1, 0);
    state.set($counter2, (value1 / value2 % 1 !== 0) ? value2 - 1 : value2);
    state.add('position', 10);
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
  }, { action: mask.command });

const isOperation = (commandList, state) => {
  const currBlock = commandList.slice(state.position, state.position + 10);
  if (currBlock.length < 6) return null;

  return masks.reduce((result, mask) =>
    matchMask(currBlock, mask) || result, null);
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

    const stateAccessor = {
      add: (register, value) => state[register] += stateOrValue(state, value),
      set: (register, value) => state[register] = stateOrValue(state, value),
      get: (value) => stateOrValue(state, value),
      out: (value) => output.push(stateOrValue(state, value)),
      tgl: (i) => {
        if (commandList[i]) commandList[i].action = toggle[commandList[i].action];
      },
    };

    const action =  operation ? operation.action : commandList[state.position].action;
    const args = operation || commandList[state.position];

    commands[action](stateAccessor, args);

    jumpLimit--;
  }

  return { output, endState: state };
};

module.exports = { commands, execute };
