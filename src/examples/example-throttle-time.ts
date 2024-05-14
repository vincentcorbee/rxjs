import { asyncScheduler } from '../constants';
import { throttleTime, interval, take } from '../operators';

// streams
const interval$ = interval(100);

// wait .5s between keyups to emit current value
const sub = interval$.pipe(throttleTime(500), take(5)).subscribe({
  next(value) {
    console.log(value);
  },
  complete() {
    console.log('completed');
  },
});

// asyncScheduler.schedule(() => sub.unsubscribe(), 10000);
