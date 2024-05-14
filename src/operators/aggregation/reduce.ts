import { OperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';

export const reduce =
  <V, A>(reducer: (acc: A | V, value: V, index: number) => A, seed?: any): OperatorFunction<V, V | A> =>
  (source) =>
    new Observable((subscriber) => {
      let result = seed;
      let index = 0;

      const subscription = source.subscribe({
        next(value) {
          result = result === undefined ? value : reducer(result, value, index);

          index++;
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.next(result);
          subscriber.complete();
        },
      });

      /* Unsubscribe from the source observable */

      return () => subscription.unsubscribe();
    });
