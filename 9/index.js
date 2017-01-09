const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8').trim();

// part 1

const decompress = str => {
  if (str.length < 1) return '';

  if (str.startsWith('(')) {
    const [ matched, length, times ] = str.match(/\((\d+)x(\d+)\)/);
    const start = matched.length;

    const toRepeat = str.slice(start, start + Number(length));
    const remainStr = str.slice(start + toRepeat.length);

    return toRepeat.repeat(times).concat(decompress(remainStr));
  } else {

    const line = str.match(/(\w+)/)[1];
    return line.concat(decompress(str.slice(line.length)));
  }
};

// console.log(decompress(input).length);

// part 2

const parse = (input) =>
  input.trim().split(/\(|\)/).reduce((result, el, index, arr) => {
    if (!el) return result;

    const markerMatch = el.match(/^((\d+)x(\d+))/);

    if (markerMatch) {
      [ _, marker, count, times ] = markerMatch;

      result.push({
        marker,
        position: 'start',
        count: Number(count),
        times: Number(times),
        length: marker.length + 2
      });

    } else if (index <= arr.length - 1) {
      result = result.concat(el.split(''));
    }

    return result;
  }, []);

const findEnd = (arr, start, count) =>
  count > 0 ? findEnd(arr, start + 1, count - arr[start + 1].length) : start + 1;

const putSeparators = arr => {
  let i = 0;
  while (i < arr.length) {
    if (arr[i].position === 'start') {
      const endIndex = findEnd(arr, i, arr[i].count);
      arr.splice(endIndex, 0, { marker: arr[i].marker, position: 'end', length: 0 });
    }
    i++;
  }
};

const decompressLength = input => {
  const arr = parse(input);
  putSeparators(arr);

  let result = 0;
  let stack = [];

  arr.forEach(el => {
    if (!el.position) result += stack.reduce((res, elem) => res * elem.times, 1);
    else if (el.position === 'start') stack.push(el);
    else if (el.position === 'end') stack.pop();
  });

  return result;
};

console.log(decompressLength(input));
