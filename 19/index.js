const input = 3001330;

const getElves = input =>
  Array.from({ length: input }).map((el, i) => ({ number: i + 1, presents: 1 }));

const steal = (elf, neighbor) =>
  ({ number: elf.number, presents: elf.presents + neighbor.presents });

// first part

const evenRound = elves =>
  elves.reduce((result, elf, ind) => {
    if (ind % 2 !== 0) return result;

    result.push(steal(elf, elves[ind + 1]));

    return result;
  }, []);

const oddRound = elves => {
  const withoutLast = evenRound(elves.slice(0, elves.length - 1));
  return withoutLast.slice(1).concat(steal(elves[elves.length - 1], withoutLast[0]));
};

const play = input => {
  let elves = getElves(input);

  while (elves.length > 1) {
    if (elves.length % 2 === 0) {
      elves = evenRound(elves);
    } else {
      elves = oddRound(elves);
    }
  }

  return elves[0];
}

// console.log(play(input));

// second part

let test = 100;

const pushArray = (target, arr) => {
  for (let i = 0; i < arr.length; i++) {
    target.push(arr[i]);
  }
};

const play2 = (input) => {
  let half1 = Array.from({ length: input / 2 }).map((_, i) => i + 1);
  let half2 = Array.from({ length: input / 2 }).map((_, i) => i + 1 + (input / 2));
  let count = 0;

  while (true) {
    if (half2.length < 2) return half1[0];

    const length = half2.length;

    for (let i = 0; i < Math.floor(length / 3); i++) {
      half2.splice(i, 2);
    }

    pushArray(half2, half1.splice(0, 2 * Math.floor(length / 2)));
    pushArray(half1, half2.splice(0, Math.floor(length / 3)));
  }
}

console.log(play2(input));
