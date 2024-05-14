import { Observable } from '../../observable';
import { Subscription } from '../../subscription';

const unsubscribe = <T>(subscriptions: Subscription<T>[]) => subscriptions.forEach((sub) => sub.unsubscribe());

export const combineLatest = <T>(...args: Observable<T>[]): Observable<T[]> =>
  new Observable((subscriber) => {
    const subscriptions: Subscription<T>[] = [];

    const values: Map<number, T> = new Map();

    const { length } = args;

    args.forEach((observable, index) => {
      const sub = observable.subscribe({
        next(value) {
          values.set(index, value);

          if (values.size === length) subscriber.next([...values.values()]);
        },
        error(error: any) {
          unsubscribe(subscriptions);

          values.clear();

          subscriber.error(error);
        },
        complete() {
          unsubscribe(subscriptions);

          values.clear();

          subscriber.complete();
        },
      });

      subscriptions.push(sub);
    });

    () => {
      values.clear();

      unsubscribe(subscriptions);
    };
  });
