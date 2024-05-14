import { Observable } from '../../observable';
import { OperatorFunction } from '../../interfaces';

export const map =
  <T, R>(project: (value: T, index: number) => R): OperatorFunction<T, R> =>
  (source) =>
    new Observable((subscriber) => {
      let index = 0;

      const subscription = source.subscribe({
        next(value) {
          subscriber.next(project(value, index++));
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
