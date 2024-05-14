import { MonoTypeOperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';

const defaultComparator = <T>(previous: T, current: T) => previous === current;

export const distinctUntilChanged =
  <T>(comparator?: (previous: T, current: T) => boolean): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      let started = false;
      let history: T | undefined;

      const comparer = comparator || defaultComparator;

      const sourceSubscription = source.subscribe({
        next(value) {
          if (!started || !comparer(history as T, value)) {
            subscriber.next(value);

            history = value;
          }

          started = true;
        },
        error(error) {
          history = undefined;

          subscriber.error(error);
        },
        complete() {
          history = undefined;

          subscriber.complete();
        },
      });

      return () => {
        history = undefined;

        sourceSubscription.unsubscribe();
      };
    });
