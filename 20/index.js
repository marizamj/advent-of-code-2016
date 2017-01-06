const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const parseInput = input =>
  input.trim().split('\n').map(line =>
    ({
      start: Number(line.split('-')[0]),
      end: Number(line.split('-')[1])
    }))
  .sort((a, b) => a.start - b.start);

const isBinsideA = (a, b) => b.start > a.start && b.end < a.end;

const isOverlapped = (a, b) => b.start - a.end <= 1 && b.end > a.end;

// first part

const findFirstAllowed = input => {
  const blocked = parseInput(input);
  const range = { start: 0, end: 4294967295 };

  blocked.forEach(el => {
    if (el.start === range.start || el.start - range.start === 1) {
      range.start = el.end;

    } else if (el.start < range.start && range.start < el.end) {
      range.start = el.end;
    }
  });

  return range.start + 1;
};

console.log(findFirstAllowed(input));

// second part

const findAllAllowed = input => {
  const blocked = parseInput(input);
  const range = { start: 0, end: 4294967295 };

  const reduced = blocked.reduce((res, el, ind) => {
    const prev = res[res.length - 1];

    if (prev && isOverlapped(prev, el)) prev.end = el.end;
    else if (prev && isBinsideA(prev, el)) return res;
    else res.push(el);

    return res;
  }, []);


  return reduced.reduce((res, el, ind, orig) =>
    orig[ind + 1] ? res + orig[ind + 1].start - el.end - 1 : res, 0);
};

// console.log(findAllAllowed(input));
