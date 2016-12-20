const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
qzmt-zixmtkozy-ivhz-343[abxyz]
a-b-c-d-e-f-g-h-987[abcde]
not-a-real-room-404[oarel]
totally-real-room-200[decoy]
`;

const listOfRooms = input.trim().split('\n')
  .map(line => line.split(/[-\[\]]+/).filter(el => el));

function isRealRoom(room) {
  const givenChecksum = room.pop();
  const id = Number(room.pop());

  const letters = room.join('').split('').reduce((res, l) => {
    res[l] ? res[l]++ : res[l] = 1;
    return res;
  }, {});

  const checksum =
    Object.keys(letters)
    .sort((a, b) => {
      const diff = letters[b] - letters[a];

      if (diff === 0) {
        return a.localeCompare(b);
      }

      return diff;
    })
    .join('')
    .slice(0, 5);

  return givenChecksum === checksum ?
    id
    :
    0;
}

function decryptRoomName(room) {
  const alphabet = 'abcdefghijklmnopqrstuvwxyz';
  const words = room.slice(0, -2);
  const id = Number(room.slice(-2, -1));

  const phrase = words.map(word => {
    return word.split('').map(l => {
      let i = alphabet.indexOf(l) + id;
      i = i % alphabet.length;
      return alphabet[i];
    }).join('');
  }).join(' ');

  return { phrase, id };
}

// const answer = listOfRooms.map(isRealRoom).reduce((res, el) => res + el, 0);
const answer2 = listOfRooms.map(decryptRoomName).find(el => el.phrase.match(/northpole/));

console.log(answer2);
