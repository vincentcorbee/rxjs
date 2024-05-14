import { MonoTypeOperatorFunction, Observer } from '../../interfaces';
import { Observable } from '../../observable';

export const tap =
  <T>(next?: Observer<T> | ((value: T) => void), error?: ((value: any) => void) | null, complete?: () => void): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable<T>((subscriber) => {
      let observer: Observer<T> = {};

      if (typeof next === 'object') {
        observer = next;
      } else if (typeof next === 'function') {
        observer = {
          next,
        };

        if (typeof error === 'function') observer.error = error;

        if (typeof complete === 'function') observer.complete = complete;
      }

      const subscription = source.subscribe({
        next(value) {
          if (observer.next) observer.next(value);

          subscriber.next(value);
        },
        error(error) {
          if (observer.error) observer.error(error);

          subscriber.error(error);
        },
        complete() {
          if (observer.complete) observer.complete();

          subscriber.complete();
        },
      });

      /* Unsubscribe from the source observable */

      return () => subscription.unsubscribe();
    });
