const crypto = require('crypto');

const input = 'udskfozm';
const test1 = 'ihgpwlah'; // DDRRRD
const test2 = 'kglvqrro'; // DDUDRLRRUDRD
const test3 = 'ulqzkmiv'; // DRURDRUDDLLDLUURRDULRLDUUDDDRR

const md5 = str => crypto.createHash('md5').update(str).digest('hex');

const go = {
  'L': coord => coord.x -= 1,
  'R': coord => coord.x += 1,
  'U': coord => coord.y -= 1,
  'D': coord => coord.y += 1
};

const create2dMatrix = (h, w) =>
  Array.from({ length: h }).map(col =>
    Array.from({ length: w }).map(cell => ' '));

const isOpen = char => {
  const keys = [ 'b', 'c', 'd', 'e', 'f' ];
  return keys.some(key => key === char);
};

const getPossibleDirections = (path, coord) => {
  const ways = [ 'U', 'D', 'L', 'R' ];
  const hash = md5(path);
  const deadEnds = [];

  if (coord.x === 0) deadEnds.push('L');
  if (coord.x === 3) deadEnds.push('R');
  if (coord.y === 0) deadEnds.push('U');
  if (coord.y === 3) deadEnds.push('D');

  return hash.slice(0, 4).split('').reduce((result, el, ind) => {
    return isOpen(el) && !deadEnds.find(end => end === ways[ind]) ?
      result.concat(ways[ind]) : result;
  }, []);
};

const findPath = input => {
  const maze = create2dMatrix(4, 4);
  const startCoords = { x: 0, y: 0 };
  let results = [];
  let minLength = Infinity;

  function step(input, coord) {
    if (coord.x === 3 && coord.y === 3) {
      results.push(input);
      minLength = input.length;
      return;
    }

    const openDoors = getPossibleDirections(input, coord);

    // first part
    // if (!openDoors && input.length >= minLength) return;

    // second part
    if (!openDoors) return;

    openDoors.forEach(door => {
      const newCoord = Object.assign({}, coord);
      go[door](newCoord);

      step(`${input}${door}`, newCoord);
    });
  }

  step(input, startCoords);

  return results.sort((a, b) => b.length - a.length)[0].slice(input.length).length;
}

console.log(findPath(input));
