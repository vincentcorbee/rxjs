import { Observable } from '../../observable';

export const scan =
  <V, A, S>(accumulator: (acc: V | A | S, value: V, index: number) => A, seed?: S) =>
  (source: Observable<V>) =>
    new Observable<V | A>((subscriber) => {
      let result: V | A | S | undefined = seed;

      let index = 0;

      const subscription = source.subscribe({
        next(value) {
          result = result === undefined ? value : accumulator(result, value, index);

          subscriber.next(result);

          index++;
        },
        error(err) {
          subscriber.error(err);
        },
        complete() {
          subscriber.complete();
        },
      });

      /* Unsubscribe from the source observable */

      return () => subscription.unsubscribe();
    });
