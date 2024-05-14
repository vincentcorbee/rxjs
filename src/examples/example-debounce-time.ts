// import { Subscription } from '../subscription';

// const asapScheduler = {
//   schedule(action: () => void, delay = 0) {
//     if (delay === 0) {
//       let isCancelled = false;

//       const promise = Promise.resolve();

//       promise.then(() => !isCancelled && action());

//       return new Subscription(() => (isCancelled = true));
//     } else {
//       const timeoutId = setTimeout(action, delay);

//       return new Subscription(() => clearTimeout(timeoutId));
//     }
//   },
// };

// const asyncScheduler = {
//   schedule(action: () => void, delay = 0) {
//     const timeoutId = setTimeout(action, delay);

//     return new Subscription(() => clearTimeout(timeoutId));
//   },
// };

// asyncScheduler.schedule(() => console.log('async')); // scheduling 'async' first...

// asapScheduler.schedule(() => console.log('asap'));

// console.log('Hoi');

import { asyncScheduler } from '../constants';
import { debounceTime, interval } from '../operators';

// streams
const interval$ = interval(100);

// wait .5s between keyups to emit current value
const sub = interval$.pipe(debounceTime(500)).subscribe(console.log);

asyncScheduler.schedule(() => sub.unsubscribe(), 10000);
