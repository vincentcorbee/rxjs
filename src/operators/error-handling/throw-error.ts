import { Observable } from '../../observable';

/**
 * Creates an observable that will create an error instance and push it to the consumer as an error immediately upon subscription.
 */
export const throwError = (errorFactory: () => any): Observable<never> =>
  new Observable((subscriber) => {
    subscriber.error(errorFactory());
  });
