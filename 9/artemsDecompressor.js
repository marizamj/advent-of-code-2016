const input = require('fs').readFileSync('./input.txt').toString().trim();

const markerRx = /\((\d+)x(\d+)\)/;

const splitRx = (input, rx, withMatch) => {
  const match = input.match(rx);

  if (match) {
    return [
      ...input.slice(0, match.index),
      withMatch(match),
      ...splitRx(input.slice(match.index + match[0].length), rx, withMatch)
    ];
  } else {
    return [ ...input ];
  }
};

const times = (s, n) => Array.from({ length: n + 1 }).join(s);

const decode = input => {
  const sequence = splitRx(input, markerRx, ([ text, characterCount, times ]) => {
    return {
      times: Number(times),
      characterCount: Number(characterCount),
      text,
      accumulator: '',
    };
  });

  const decoded = sequence.reduce((acc, item, index, arr) => {
    const { string, inMarker } = acc;

    const isMarker = typeof item === 'object';
    const isText = !isMarker;

    const isLast = index === arr.length - 1;

    if (!inMarker && isText) {
      return {
        string: string + item,
        inMarker,
      };
    }

    if (!inMarker && isMarker) {
      return {
        string,
        inMarker: item,
      };
    }

    if (inMarker) {
      inMarker.accumulator += (isMarker ? item.text : item);

      if (inMarker.accumulator.length >= inMarker.characterCount || isLast) {
        return {
          string: string + times(inMarker.accumulator, inMarker.times),
          inMarker: null,
        };
      }
    }

    return acc;
  }, {
    string: '',
    inMarker: null
  });

  return decoded;
};

// console.log(decode('(8x10)a(1x10)b').string.length);

module.exports = (input) => {
  return decode(input).string;
};
