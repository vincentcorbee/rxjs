import { OperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';

export const startWith =
  <T, D>(...values: D[]): OperatorFunction<T, T | D> =>
  (source) =>
    new Observable((subscriber) => {
      for (const value of values) subscriber.next(value);

      const subscription = source.subscribe(subscriber);

      /* Unsubscribe from the source observable */

      return () => subscription.unsubscribe();
    });
