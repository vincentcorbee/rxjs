export const isIterable = (obj: any) => (obj === null || obj === undefined ? false : typeof obj[Symbol.iterator] === 'function');
