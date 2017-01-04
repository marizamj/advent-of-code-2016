const diskLength_1 = 272;
const diskLength_2 = 35651584;
const initData = '11110010111001001';

const generateNewData = data => {
  const replace = {
    '0': 1,
    '1': 0
  };

  const a = data;
  const b = data.split('').reverse().map(el => replace[el]).join('');

  return `${a}0${b}`;
};

const generateEnoughForDisk = (data, diskLength) =>
  data.length >= diskLength ?
    data.slice(0, diskLength)
    :
    generateEnoughForDisk(generateNewData(data), diskLength);

const getChecksum = data => {
  const checksum = data
    .match(/\d{2}/g)
    .map(pair => pair.charAt(0) === pair.charAt(1) ? 1 : 0).join('');

  return checksum.length % 2 !== 0 ? checksum : getChecksum(checksum);
};

const processData = (data, diskLength) => {
  const finalData = generateEnoughForDisk(data, diskLength);
  return getChecksum(finalData);
}

console.log(processData(initData, diskLength_2));
