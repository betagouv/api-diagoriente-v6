export default function <T extends { [key: string]: any }, R>(
  obj: T,
  callback: (value: T[keyof T], key: keyof T, obj: T) => R,
) {
  const keys = Object.keys(obj);
  const result: any = {};

  keys.forEach((key) => {
    result[key] = callback(obj[key], key, obj);
  });

  return result;
}
