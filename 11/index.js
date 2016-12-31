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

const _ = null;

const initPlan = [
  [  'E' , 'PmG', 'PmM',   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  , 'DiG', 'DiM', 'ElG', 'ElM' ], // 1
  [   _  ,   _  ,   _  , 'CoG',   _  , 'CmG',   _  , 'RuG',   _  , 'PuG',   _  ,   _  ,   _  ,   _  ,   _   ], // 2
  [   _  ,   _  ,   _  ,   _  , 'CoM',   _  , 'CmM',   _  , 'RuM',   _  , 'PuM',   _  ,   _  ,   _  ,   _   ], // 3
  [   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _  ,   _   ]  // 4
];

const heuristic = plan =>
  plan.reduce((result, floor, ind) =>
    result + floor.reduce((res, el) =>
      el !== null && el !== 'E' ?
        res + plan.length - 1 - ind
        :
        res, 0), 0);


const isSafe = plan =>
  plan.every(floor => floor.every(el => {
    if (el !== null && el[2] === 'M') {
      const element = el.slice(0, 2);
      const hasOwnGen = floor.includes(`${element}G`);
      const hasOtherGen = floor.some(el =>
        el && !el.startsWith(element) && el[2] === 'G');

      return hasOwnGen || !hasOtherGen;
    }

    return true;
  }));


const move = (plan, indices, currFloor, direction) => {
  if (direction === 'down' && currFloor === 0) return null;
  if (direction === 'up' && currFloor === plan.length - 1) return null;

  const floorToChange = direction === 'down' ? currFloor - 1 : currFloor + 1;

  const newPlan = plan.map(floor => floor.map(el => el));
  newPlan[floorToChange][0] = 'E';
  newPlan[currFloor][0] = _;

  indices.forEach(ind => {
    newPlan[floorToChange][ind] = newPlan[currFloor][ind];
    newPlan[currFloor][ind] = _;
  });

  return newPlan;
}


const nextSteps = plan => {
  const currFloor = plan.findIndex(floor => floor[0] === 'E');
  const indices = plan[currFloor].map((el, i) =>
    el !== null ? i : el).filter(el => el !== null).slice(1);

  const combinations = indices.reduce((result, el, ind) => {
    result.push([ el ]);
    for (let i = ind + 1; i < indices.length; i++) {
      result.push([ el ].concat(indices[i]));
    }
    return result;
  }, []);

  return combinations.reduce((result, combo) => {
    result.push(move(plan, combo, currFloor, 'up'));
    result.push(move(plan, combo, currFloor, 'down'));
    return result;
  }, [])
    .filter(el => el !== null && isSafe(el));
}

const isEnd = plan => heuristic(plan) === 0;

const distance = (a, b) => 1;

const path = aStar({
  start: initPlan,
  neighbor: nextSteps,
  isEnd,
  distance,
  heuristic,
  hash: JSON.stringify
});

console.log(path.status, path.cost);
