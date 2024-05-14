import { MonoTypeOperatorFunction, RetryConfig } from '../../interfaces';
import { Observable } from '../../observable';
import { Subscriber } from '../../subscriber';
import { Subscription } from '../../subscription';

const subscribe = <T>(subscriber: Subscriber<T>, source: Observable<T>, count: number, itteration: number, parentSubscription?: Subscription<T>) => {
  const subscription = source.subscribe({
    next(value) {
      subscriber.next(value);
    },
    error(error: any) {
      if (itteration < count) subscribe(subscriber, source, count, itteration + 1, parentSubscription ?? subscription);
      else {
        subscriber.error(error);

        (parentSubscription ?? subscription).unsubscribe();
      }
    },
    complete() {
      subscriber.complete();
    },
  });

  if (parentSubscription) parentSubscription.add(subscription);

  return subscription;
};

export const retry =
  <T>(configOrCount: number | RetryConfig = Infinity): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable<T>((subscriber) => {
      const config = typeof configOrCount === 'number' ? { count: configOrCount } : { count: Infinity, ...configOrCount };

      const sourceSubscription = subscribe(subscriber, source, config.count, 0);

      return () => sourceSubscription.unsubscribe();
    });
