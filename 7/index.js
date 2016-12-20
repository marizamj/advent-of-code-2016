const fs = require('fs');

const input = fs.readFileSync('input.txt', 'utf8');

const parseIPs = (input) => input.trim().split('\n').map(line => {
  const ss = line.match(/\]*(\w+)\[*/g)
    .filter(part => part.startsWith(']') || part.endsWith('['));
  const hs = line.match(/\[(\w+)\]/g);
  return { ss, hs };
});

const hasABBA = (str) => {
  let match = null;

  for (let i = 0; i < str.length - 3; i++) {
    let cond =
      str.charAt(i) === str.charAt(i + 3)
      && str.charAt(i + 1) === str.charAt(i + 2)
      && str.charAt(i) !== str.charAt(i + 1);

    if (cond) {
      match = true;
      break;
    }
  }

  return match;
}

const doesSupportTLS = (ip) => {
  const abbaInHs = ip.hs.some(el => hasABBA(el));
  if (abbaInHs) return false;
  return ip.ss.some(el => hasABBA(el));
}

// second part

const findABAs = (str) => {
  let match = [];

  for (let i = 0; i < str.length - 2; i++) {
    let cond =
      str.charAt(i) === str.charAt(i + 2)
      && str.charAt(i) !== str.charAt(i + 1);

    if (cond) match.push(str.slice(i, i + 3));
  }

  return match;
}

const findBABs = (str, aba) => {
  const regex = new RegExp(`(${aba.charAt(1)}${aba.charAt(0)}${aba.charAt(1)})`, 'g');
  return str.match(regex);
}

const doesSupportSSL = (ip) => {
  const ABAs = ip.ss.map(ss => findABAs(ss)).reduce((res, el) => res.concat(el), []);

  if (ABAs.length < 1) return false;

  return ABAs.map(aba => ip.hs.some(hs => findBABs(hs, aba)))
    .reduce((res, el) => res || el, false);
}

// results

const IPs = parseIPs(input);

// const filteredIPs = IPs.filter(ip => doesSupportTLS(ip));

const filteredIPs = IPs.filter(ip => doesSupportSSL(ip));

console.log(filteredIPs.length);



