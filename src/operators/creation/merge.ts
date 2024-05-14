import { Observable } from '../../observable';
import { Subscriber } from '../../subscriber';

const subscribe = <T>(
  subscriber: Subscriber<T>,
  observable: Observable<T>,
  stack: Set<Observable<T>>,
  observables: Observable<T>[],
  concurrent: number,
): void => {
  const subscription = observable.subscribe({
    next(value: T) {
      subscriber.next(value);
    },
    error(err: any) {
      subscriber.error(err);
    },
    complete() {
      stack.delete(observable);

      if (observables.length && stack.size < concurrent) {
        const nextObservable = observables.shift() as Observable<T>;

        stack.add(nextObservable);

        subscribe(subscriber, nextObservable, stack, observables, concurrent);
      }

      if (stack.size === 0) subscriber.complete();

      subscription.unsubscribe();
    },
  });
};

export const merge = <T>(...args: (Observable<T> | number)[]): Observable<T | number> =>
  new Observable<T | number>(async (subscriber) => {
    try {
      const concurrent = typeof args[args.length - 1] === 'number' ? (args.pop() as number) : Infinity;

      const stack = new Set<Observable<T>>(args.splice(0, concurrent) as Observable<T>[]);

      for (const observable of stack) {
        subscribe(subscriber, observable as Observable<T>, stack, args as Observable<T>[], concurrent);
      }
    } catch (err) {
      return subscriber.error(err);
    }
  });
