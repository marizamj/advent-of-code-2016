const nip = n => isNaN(Number(n)) ? n : Number(n);

const zip = ([a0, ...aRest], [b0, ...bRest]) =>
  a0 && b0 ? [[a0, b0], ...zip(aRest, bRest)] : [];

const toggle = { inc: 'dec', dec: 'inc', tgl: 'inc', cpy: 'jnz', jnz: 'cpy' };

const parse = input =>
  input.trim().split('\n').map(line => {
    const [ action, x, y ] = line.trim().split(' ');
    return { action, x: nip(x), y: nip(y) };
  });

const commands = {
  cpy: (commandList, state, x, y) => {
    if (isNaN(y) && isNaN(x)) state[y] = state[x];
    if (isNaN(y) && !isNaN(x)) state[y] = x;
    state.position++;
  },

  inc: (commandList, state, x) => {
    state[x]++;
    state.position++;
  },

  dec: (commandList, state, x) => {
    state[x]--;
    state.position++;
  },

  jnz: (commandList, state, x, y) => {
    if (!isNaN(x) && x !== 0) {
      state.position += (state[y] || y);

    } else {

      if (state[x] !== 0) state.position += (state[y] || y);
      else state.position++;
    }
  },

  tgl: (commandList, state, x) => {
    const n = state[x] || x;
    const target = commandList[state.position + n];
    if (target) target.action = toggle[target.action];
    state.position++;
  },

  mul: (state, resultReg, mulRegs, toZeroRegs) => {
    const multipliers = mulRegs.map(el => state[el] ? state[el] : el);

    state[resultReg] = multipliers[0] * multipliers[1];
    state[toZeroRegs[0]] = 0;
    state[toZeroRegs[1]] = 0;

    state.position += 8;
  }
};

const mulMask = `
  cpy $value1 $counter1
  cpy 0 $dest
  cpy $value2 $counter2
  inc $dest
  dec $counter2
  jnz $counter2 -2
  dec $counter1
  jnz $counter1 -5
`;

const compare = (result, el, maskEl) => {
  if (maskEl === undefined && el === undefined) return true;
  if (typeof maskEl === 'number') return el === maskEl;
  if (maskEl.startsWith('$') && typeof maskEl === 'string') {
    return result[maskEl] ? result[maskEl] === el : true;
  }
};

const matchMask = (block, mask) =>
  zip(block, mask).reduce((result, [ command, maskExpr ]) => {
    if (result === null) return result;
    if (command.action !== maskExpr.action) return null;

    if (compare(result, command.x, maskExpr.x) && compare(result, command.y, maskExpr.y)) {
      result[maskExpr.x] = command.x;
      result[maskExpr.y] = command.y;
    } else return null;

    return result;
  }, {});

const isMultiply = (commandList, state) => {
  const currBlock = commandList.slice(state.position, state.position + 8);
  if (currBlock.length < 8) return null;

  const match = matchMask(currBlock, parse(mulMask));

  if (match) {
    return {
      resultReg: match.$dest,
      mulRegs: [ match.$value1, match.$value2 ],
      toZeroRegs: [ match.$counter1, match.$counter2 ]
    };
  }

  return null;
};

const execute = (input, state = { position: 0, a: 0, b: 0, c: 0, d: 0 }) => {
  let commandList = parse(input);

  while (state.position < commandList.length) {
    const multiply = isMultiply(commandList, state);

    if (multiply) {
      const { resultReg, mulRegs, toZeroRegs } = multiply;
      commands.mul(state, resultReg, mulRegs, toZeroRegs);

    } else {
      const { action, x, y } = commandList[state.position];
      commands[action](commandList, state, x, y);
    }
  }

  return state;
};

module.exports = { commands, execute };
