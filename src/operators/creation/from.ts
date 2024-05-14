import { Observable } from '../../observable';
import { isIterable, isPromiseLike } from '../../helpers';
import { ObservableInput } from '../../types';
import { Subscriber } from '../../subscriber';

export const from = <T>(source: ObservableInput<T>): Observable<T> =>
  new Observable<ObservableInput<T> | T>((subscriber) => {
    let isSubscribed = true;

    const handlePromise = <T>(value: any, subscriber: Subscriber<T>) =>
      (isPromiseLike<T>(value) ? (value as PromiseLike<T>) : Promise.resolve(value)).then((resolvedValue) => subscriber.next(resolvedValue));

    try {
      const values: PromiseLike<any>[] = [];

      if (isIterable(source)) {
        for (const value of source as Iterable<T>) values.push(handlePromise(value, subscriber));
      } else values.push(handlePromise(source, subscriber));

      Promise.all(values)
        .then(() => isSubscribed && subscriber.complete())
        .catch(isSubscribed && subscriber.error.bind(subscriber));
    } catch (err) {
      isSubscribed && subscriber.error(err);
    }

    return () => (isSubscribed = false);
  });
