import { Observable } from '../';

const observable = new Observable<number>((subscriber) => {
  const intervalId = setInterval(() => {
    subscriber.next(Math.random());
  }, 1500);

  /* Cleanup logic */
  return () => clearInterval(intervalId);
});

observable.subscribe({ next: (value) => console.log(`sub1 ${value}`) });
