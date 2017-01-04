const input = `
Disc #1 has 17 positions; at time=0, it is at position 5.
Disc #2 has 19 positions; at time=0, it is at position 8.
Disc #3 has 7 positions; at time=0, it is at position 1.
Disc #4 has 13 positions; at time=0, it is at position 7.
Disc #5 has 5 positions; at time=0, it is at position 1.
Disc #6 has 3 positions; at time=0, it is at position 0.
`;

const parseInput = input =>
  input.trim().split('\n').map(line => {
    const number = Number(line.match(/\#(\d+)/)[1]);
    const positions = Number(line.match(/has (\d+) positions/)[1]);
    const startPosition = Number(line.match(/at time=0, it is at position (\d+)/)[1]);

    return {
      number,
      positions,
      startPosition
    }
  });

const getPositionAtTime = (disc, time) => (time + disc.startPosition) % disc.positions;

const getAllPositionsForTime = (discs, time) =>
  discs.map(disc => getPositionAtTime(disc, time + disc.number));

const findSuitableTime = (input) => {
  const discs = parseInput(input);

  // for part 2
  discs.push({ number: discs.length + 1, positions: 11, startPosition: 0 });

  let result;
  let i = 0;

  while (!result) {
    const areAllAt0 = getAllPositionsForTime(discs, i).every(pos => pos === 0);

    if (areAllAt0) result = i;

    i++;
  }

  return result;
}

console.log(findSuitableTime(input));

