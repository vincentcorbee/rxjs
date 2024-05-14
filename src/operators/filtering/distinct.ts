import { Observable } from '../../observable';
import { getKeys } from '../../helpers';
import { MonoTypeOperatorFunction } from '../../interfaces';

export const distinct =
  <T>(differ?: (value: T) => any): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      const history = new Set<any>();

      const subscription = source.subscribe({
        next(value) {
          if (typeof differ === 'function' && typeof value === 'object') {
            const [key, val] = differ(getKeys(value));

            for (const item of history) {
              if (item[key] === val) return;
            }

            history.add(value);

            subscriber.next(value);
          } else if (!history.has(value)) {
            history.add(value);

            subscriber.next(value);
          }
        },
        error(err) {
          subscriber.error(err);

          history.clear();
        },
        complete() {
          subscriber.complete();

          history.clear();
        },
      });

      /* Unsubscribe from the source observable */

      return () => {
        history.clear();

        subscription.unsubscribe();
      };
    });
