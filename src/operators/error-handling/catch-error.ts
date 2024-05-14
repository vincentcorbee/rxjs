import { OperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';
import { ObservableInput, ObservedValueOf } from '../../types';

export const catchError =
  <T, O extends ObservableInput<any>>(selector: (err: any, caught: Observable<T>) => O): OperatorFunction<T, T | ObservedValueOf<O>> =>
  (source) =>
    new Observable((subscriber) => {
      const subscription = source.subscribe({
        error(error: any) {
          const returnValue = selector(error, source);

          if (returnValue instanceof Observable) returnValue.subscribe(subscriber);
        },
      });

      return () => subscription.unsubscribe();
    });
