import { interval, map, mergeAll } from '../';
import { of } from '../';

const myPromise = <T>(value: T) => new Promise<string>((resolve) => setTimeout(() => resolve(`Result: ${value}`), 2000));
//emit 1,2,3
const source = of(1, 2, 3);

const example = source.pipe(
  //map each value to promise
  map((value) => myPromise(value)),
  //emit result from source
  mergeAll(),
);

/*
  output:
  "Result: 1"
  "Result: 2"
  "Result: 3"
*/
const subscribe = example.subscribe({
  next: (value) => console.log(value),
  complete() {
    console.log('completed');
  },
});
