import { OperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';

export const defaultIfEmpty =
  <T, R>(defaultValue: R): OperatorFunction<T, T | R> =>
  (source) =>
    new Observable((subsriber) => {
      let hasEmitted = false;

      const subscription = source.subscribe({
        next(value) {
          hasEmitted = true;

          subsriber.next(value);
        },
        error(error: any) {
          subsriber.error(error);
        },
        complete() {
          if (!hasEmitted) subsriber.next(defaultValue);

          subsriber.complete();
        },
      });

      return () => subscription.unsubscribe();
    });
