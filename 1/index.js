const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = 'R8, R4, R4, R8';

const instructions = input.trim().split(', ');

function findDistance(instructions) {

  function go(coords) {
    const sides = [ 'n', 'e', 's', 'w' ];

    const compass = {
      n: (coords) => coords.y += 1,
      e: (coords) => coords.x += 1,
      s: (coords) => coords.y -= 1,
      w: (coords) => coords.x -= 1
    };

    compass[sides[coords.face]](coords);
  }

  let destination = { x: 0, y: 0, face: 0 };
  let visited = { 'x0y0': true };

  let found = false;

  instructions.forEach(order => {
    if (found) {
      return;
    }

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

    for (let i = 0; i < steps; i++) {
      if (found) {
        break;
      }

      go(destination, steps);

      const newKey = `x${destination.x}y${destination.y}`;

      visited[newKey] ?
        found = true
        :
        visited[newKey] = true;
    }
  });

  return Math.abs(destination.x) + Math.abs(destination.y);
}

console.log(findDistance(instructions));

