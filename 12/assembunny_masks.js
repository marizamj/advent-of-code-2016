const masks = [
  { command: 'sub',
    pattern: `
      cpy $value1 $dest
      jnz $value2 2
      jnz 1 4
      dec $dest
      dec $value2
      jnz 1 -4
  ` },

  { command: 'mul',
    pattern: `
      cpy $value1 $counter1
      cpy $init $dest
      cpy $value2 $counter2
      inc $dest
      dec $counter2
      jnz $counter2 -2
      dec $counter1
      jnz $counter1 -5
  ` },

  { command: 'mul',
    pattern: `
      cpy $init $dest
      cpy $value1 $counter1
      cpy $value2 $counter2
      inc $dest
      dec $counter2
      jnz $counter2 -2
      dec $counter1
      jnz $counter1 -5
  ` },

  { command: 'div',
    pattern: `
      cpy $value1 $counter1
      cpy 0 $dest
      cpy $value2 $counter2
      jnz $counter1 2
      jnz 1 6
      dec $counter1
      dec $counter2
      jnz $counter2 -4
      inc $dest
      jnz 1 -7
  ` }
];

module.exports = masks;
