const fs = require('fs');

// const artemsDecompressor = require('./artemsDecompressor');

// 151273400 too low
// 5614930465028920000 too high

const input = fs.readFileSync('input.txt', 'utf8').trim();
const test = 'X(8x2)(3x3)ABCY';

const test2 = '(25x3)(3x3)ABC(2x3)XY(5x2)PQRSTX(18x9)(3x2)TWO(5x7)SEVEN';
// should become 445

const test3 = '(27x12)(20x12)(13x14)(7x10)(1x12)A';
// should become 241920

const test4 = '(8x10)a(1x10)b';

const decompress = (str) => {
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
}

const splitIntoParts = (str) => {
  function s(str, arr) {
    if (str.length < 1) {
      return arr;

    } else if (str.match(/^\w/)) {
      arr.push(str.slice(0, 1));
      s(str.slice(1), arr);

    } else {
      const [ marker, n, times ] = str.match(/\((\d+)x(\d+)\)/);

      arr.push(str.slice(0, marker.length + Number(n)));

      const newStr = str.slice(marker.length + Number(n));
      s(newStr, arr);
    }
  }

  let arr = [];
  s(str, arr);
  return arr;
}

const deepSplitIntoParts = (arr) => {
  return arr.map(el => {
    if (el.match(/^(\(\w+\)){2,}/)) {
      const marker = el.match(/^\((\d+x\d+)\){1,}/)[1];
      const count = el.match(/^\((\d+)x\d+\){1,}/)[1];
      const times = el.match(/^\(\d+x(\d+)\){1,}/)[1];
      const remainings = [ el.slice(marker.length + 2) ];

      return { marker, count, times, remainings: deepSplitIntoParts(remainings) };

    } else {
      if (el.length > 200) {
        return deepSplitIntoParts(splitIntoParts(el));
      }

      return el;
    }
  });
}


const computeLength = (arr) => {
  return arr.reduce((result, el) => {
    if (typeof el === 'string') {

      let oldStr = '';
      let newStr = el;

      while (oldStr.length < newStr.length) {
        oldStr = newStr;
        newStr = decompress(newStr);
      }

      return result + newStr.length;

    } else if (Array.isArray(el)) {
      return result + computeLength(el);
    } else {
      return result + (el.times * computeLength(el.remainings));

    }
  }, 0);
};

const splitted = splitIntoParts(input);

// const rest = splitted.splice(26, 2);

const deepSplitted = deepSplitIntoParts(splitted);

// console.log(computeLength(deepSplitted));

// console.log(rest);

console.log(JSON.stringify(deepSplitted, null, 2));


// splitted.forEach((el, i) => {
//   console.log(i, el.length);
// })


// const computeLength = (arr) => {
//   return arr.reduce((result, el) => {
//     if (el.length === 1) return result + 1;

//     let oldStr = '';
//     let newStr = el;

//     while (oldStr.length < newStr.length) {
//       oldStr = newStr;
//       newStr = decompress(newStr);
//     }

//     return result + newStr.length;
//   }, 0);
// }

// console.log(computeLength(splitted));






// const countLength = (str) => {
//   const regex = /(\(\w+\)){1,}/g;

//   let count = str.replace(regex, '').length;

//   const matches = str.match(regex);

//   matches.forEach(el => {
//     const parts = el.match(/(\d+x\d)/g);

//     if (parts.length < 2) {
//       const times = Number(parts[0].split('x')[1]) - 1;
//       count += Number(parts[0].split('x')[0]) * times;
//     }

//     if (parts.length > 1) {
//       const parsed = parts.map(part =>
//         ({ n: Number(part.split('x')[0]), times: Number(part.split('x')[1]) }));

//       for (let i = 0; i < parts.length; i++) {
//         const mult = parsed.reduce((res, el, ind) => {
//           return res * (el.times - (parsed.length - i - 1));
//         }, 1);

//         count += mult * parsed[i].n;
//       }
//     }

//   });

//   return count;
// };


// console.log(countLength(test));
// console.log('XABCABCABCABCABCABCY'.length);
