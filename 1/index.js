const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const test = 'R2, R2, R2';

// 12:55

const instructions = input.trim().split(', ');

function findDistance(instructions) {

  function go(coords, steps) {
    const sides = [ 'n', 'e', 's', 'w' ];

    const compass = {
      n: (coords, steps) => coords.y += steps,
      e: (coords, steps) => coords.x += steps,
      s: (coords, steps) => coords.y -= steps,
      w: (coords, steps) => coords.x -= steps
    };

    compass[sides[coords.face]](coords, steps);
  }

  let destination = { x: 0, y: 0, face: 0 };

  instructions.forEach(order => {
    const turn = order.split('')[0];
    const steps = Number(order.slice(1));

    turn === 'R' ?
      destination.face++
      :
      destination.face--;

    if (destination.face < 0) {
      destination.face += 4;
    } else if (destination.face > 3) {
      destination.face -= 4;
    }

    go(destination, steps);
  });

  return Math.abs(destination.x) + Math.abs(destination.y);
}

console.log(findDistance(instructions));

