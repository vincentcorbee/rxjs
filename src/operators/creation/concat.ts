import { Observable } from '../../observable';
import { Subscriber } from '../../subscriber';

const subscribe = <T>(subscriber: Subscriber<T>, observable: Observable<T>, observableInputs: Observable<T>[]) => {
  const subscription = observable.subscribe({
    next(value: T) {
      subscriber.next(value);
    },
    error(error: any) {
      subscriber.error(error);
    },
    complete() {
      const observable = observableInputs.shift();

      if (!observable) subscriber.complete();
      else subscription.add(subscribe(subscriber, observable, observableInputs));
    },
  });

  return subscription;
};

export const concat = <T>(...observableInputs: Observable<T>[]): Observable<T> =>
  new Observable((subscriber) => {
    const innerObservable = observableInputs.shift();

    if (!innerObservable) {
      subscriber.complete();

      return;
    }

    const subscription = subscribe(subscriber, innerObservable, observableInputs);

    return () => subscription.unsubscribe();
  });
