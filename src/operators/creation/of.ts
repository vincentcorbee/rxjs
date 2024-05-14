import { isPromiseLike } from '../../helpers';
import { Observable } from '../../observable';

export const of = <T>(...source: T[]): Observable<T> =>
  new Observable<T>((subscriber) => {
    let isSubscribed = true;

    try {
      const values: PromiseLike<any>[] = [];

      for (const value of source)
        values.push(
          (isPromiseLike<T>(value) ? (value as PromiseLike<T>) : Promise.resolve(value)).then((resolvedValue) => {
            if (isSubscribed) subscriber.next(resolvedValue);
          }),
        );

      Promise.all(values)
        .then(() => isSubscribed && subscriber.complete())
        .catch((error: any) => {
          throw error;
        });
    } catch (error: any) {
      console.log(error);
      if (isSubscribed) subscriber.error(error);
    }

    return () => (isSubscribed = false);
  });
