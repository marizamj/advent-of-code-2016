const fs = require('fs');

const aStar = require('a-star');

const input = `
The first floor contains a promethium generator and a promethium-compatible microchip|

The second floor contains a cobalt generator, a curium generator, a ruthenium generator,
and a plutonium generator|

The third floor contains a cobalt-compatible microchip, a curium-compatible microchip,
a ruthenium-compatible microchip, and a plutonium-compatible microchip|

The fourth floor contains nothing relevant.
`;

const dictionary = {
  PmG: 'a',
  PmM: 'b',
  DiG: 'c',
  DiM: 'd',
  ElG: 'e',
  ElM: 'f',
  CoG: 'g',
  CoM: 'h',
  CmG: 'i',
  CmM: 'j',
  RuG: 'k',
  RuM: 'l',
  PuG: 'm',
  PuM: 'n'
};

// 'DiG', 'DiM', 'ElG', 'ElM'

const initPlan = {
  currentFloor: 0,
  plan: [
    [ 'PmG', 'PmM' ], // 1
    [ 'CoG', 'CmG', 'RuG', 'PuG' ], // 2
    [ 'CoM', 'CmM', 'RuM', 'PuM' ], // 3
    [ ]  // 4
  ]
};

const heuristic = state =>
  state.plan.reduce((result, floor, ind) =>
    result + floor.reduce((res, el) => res + state.plan.length - 1 - ind, 0), 0);

const isSafe = state =>
  state.plan.every(floor => floor.every(el => {
    if (el.charAt(2) === 'M') {
      const element = el.slice(0, 2);
      const hasOwnGen = floor.includes(`${element}G`);
      const hasOtherGen = floor.some(el =>
        !el.startsWith(element) && el.charAt(2) === 'G');

      return hasOwnGen || !hasOtherGen;
    }

    return true;
  }));

const move = (state, elements, direction) => {
  const { currentFloor, plan } = state;

  const nextFloor = direction === 'down' ? currentFloor - 1 : currentFloor + 1;
  const newPlan = plan.map(floor => floor.map(el => el));

  elements.forEach(el => {
    newPlan[nextFloor].push(newPlan[currentFloor].find(e => e === el));
    newPlan[currentFloor] = newPlan[currentFloor].filter(e => e !== el);
  });

  return { currentFloor: nextFloor, plan: newPlan };
};

const nextSteps = state => {
  const { currentFloor, plan } = state;

  const combinations = plan[currentFloor].reduce((result, el, ind, arr) => {
    result.push([ el ]);
    for (let i = ind + 1; i < arr.length; i++) {
      result.push([ el ].concat(arr[i]));
    }
    return result;
  }, []);

  return combinations.reduce((result, combo) => {
    if (currentFloor > 0) result.push(move(state, combo, 'down'));
    if (currentFloor < 3) result.push(move(state, combo, 'up'));
    return result;
  }, []).filter(el => isSafe(el));
};

const hash = state =>
  state.currentFloor + state.plan.reduce((result, floor, i) =>
    result + i + floor.sort().map(el => dictionary[el]).join(''), '');

let minScore = +Infinity;

const isEnd = state => {
  const score = heuristic(state);

  if (score < minScore) {
    console.log(score);
    minScore = score;
  }

  return score === 1;
};


const distance = (a, b) => 1;

const path = aStar({
  start: initPlan,
  neighbor: nextSteps,
  isEnd,
  distance,
  heuristic,
  hash
});

console.log(path.status, path.cost);
