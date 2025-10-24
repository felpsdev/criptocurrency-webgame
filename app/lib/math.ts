export function genRandomInt(min: number, max: number) {
  return Math.floor((max - min) * Math.random() + min);
}

export function genCode(length: number) {
  let result = "";

  for (let i = 0; i < length; i++) {
    result += genRandomInt(0, 9).toString();
  }

  return result;
}
