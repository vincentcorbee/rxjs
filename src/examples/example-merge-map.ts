import { of, mergeMap, interval, map } from '../';

const letters = of('a', 'b', 'c');
const result = letters.pipe(mergeMap((x, j) => interval(1000).pipe(map((i) => `${x} + ${i}:${j}`)), 2));

const subscription = result.subscribe((x) => console.log(x));

setTimeout(() => subscription.unsubscribe(), 2000);

// Results in the following:
// a0
// b0
// c0
// a1
// b1
// c1
// continues to list a, b, c every second with respective ascending integers
