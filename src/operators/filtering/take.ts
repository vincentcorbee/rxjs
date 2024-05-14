import { MonoTypeOperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';

export const take =
  <T>(count: number): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      let itteration = 0;

      const subscription = source.subscribe({
        next(value) {
          if (itteration++ < count) {
            subscriber.next(value);
          } else {
            subscription.unsubscribe();

            subscriber.complete();
          }
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
