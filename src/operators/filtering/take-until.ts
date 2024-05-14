import { MonoTypeOperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';
import { ObservableInput } from '../../types';
import { from } from '../creation';

export const takeUntil =
  <T>(notifier: ObservableInput<any>): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      let emitted = false;

      const sourceSubscription = source.subscribe({
        next(value) {
          if (emitted) subscriber.complete();
          else subscriber.next(value);
        },
        error(error) {
          subscriber.error(error);
        },
        complete() {
          subscriber.complete();
        },
      });

      const notifierSubscription = (notifier instanceof Observable ? notifier : from(notifier)).subscribe({
        next() {
          if (!emitted) {
            emitted = true;

            sourceSubscription.unsubscribe();
          }
        },
      });

      sourceSubscription.add(notifierSubscription);

      /* Unsubscribe from the source observable */

      return () => sourceSubscription.unsubscribe();
    });
