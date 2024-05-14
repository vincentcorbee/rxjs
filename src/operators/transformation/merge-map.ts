import { OperatorFunction } from '../../interfaces';
import { Observable } from '../../observable';
import { Subscriber } from '../../subscriber';
import { Subscription } from '../../subscription';
import { ObservableInput, ObservedValueOf } from '../../types';
import { from } from '../creation';

const subscribe = <T>(
  subscriber: Subscriber<T>,
  observable: Observable<T>,
  queue: Observable<T>[],
  stack: Set<Observable<T>>,
  concurrent: number,
  sourceSubscription: Subscription<T>,
  sourceState: { completed: boolean },
): void => {
  stack.add(observable);

  const innerSubscription = observable.subscribe({
    next(value: T) {
      subscriber.next(value);
    },
    error(err: any) {
      subscriber.error(err);
    },
    complete() {
      stack.delete(observable);

      if (queue.length > 0 && stack.size < concurrent) {
        const nextObservable = queue.shift() as Observable<T>;

        stack.add(nextObservable);

        subscribe(subscriber, nextObservable, queue, stack, concurrent, sourceSubscription, sourceState);
      }

      if (sourceState.completed && stack.size === 0 && queue.length === 0) subscriber.complete();
    },
  });

  sourceSubscription.add(innerSubscription);
};

export const mergeMap =
  <T, O extends ObservableInput<any>>(project: (value: T, index: number) => O, concurrent: number = Infinity): OperatorFunction<T, ObservedValueOf<O>> =>
  (source) =>
    new Observable((subscriber) => {
      let index = 0;

      const sourceState = { completed: false };

      const stack = new Set<Observable<O>>();

      let queue: Observable<O>[] = [];

      const sourceSubscription = source.subscribe({
        next(observableInput) {
          const projectValue = project(observableInput, index++);

          const observable = projectValue instanceof Observable ? projectValue : from(projectValue);

          if (stack.size >= concurrent) queue.push(observable);
          else subscribe(subscriber, observable, queue, stack, concurrent, sourceSubscription, sourceState);
        },
        error(error: any) {
          stack.clear();

          queue = [];

          subscriber.error(error);
        },
        complete() {
          sourceState.completed = true;
        },
      });

      return () => {
        stack.clear();

        queue = [];

        sourceSubscription.unsubscribe();
      };
    });
