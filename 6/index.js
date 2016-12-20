const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');
const test = `
eedadn
drvtee
eandsr
raavrd
atevrs
tsrnev
sdttsa
rasrtv
nssdts
ntnada
svetve
tesnvt
vntsnd
vrdear
dvrsen
enarar
`;

const parseMessages = (input) =>
  input.trim().split('\n').map(line => line.split(''));

const reduceLine = (storage, line) =>
  line.reduce((res, char, i) => {
    storage[i] = storage[i] || {};

    if (!storage[i][char]) storage[i][char] = 0;
    storage[i][char]++;

    return storage;
  }, storage);

const recoverMessage = (messages) => {
  let storage = [];

  messages.forEach(line => reduceLine(storage, line));

  return storage.map(pos =>
    Object.keys(pos)
    .sort((a, b) => pos[b] - pos[a]))
    .map(line => line[line.length - 1])
    .join('');
}

const messages = parseMessages(input);

const recovered = recoverMessage(messages);

console.log(recovered);
