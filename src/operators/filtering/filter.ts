import { MonoTypeOperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';

export const filter =
  <T>(predicate: (value: T, index: number) => boolean): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      let index = 0;

      const subscription = source.subscribe({
        next(value) {
          if (predicate(value, index++)) subscriber.next(value);
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      /* Unsubscribe from the source observable */

      return () => subscription.unsubscribe();
    });
