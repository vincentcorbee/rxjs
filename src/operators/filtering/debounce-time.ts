import { asyncScheduler } from '../../constants';
import { MonoTypeOperatorFunction, SchedulerLike } from '../../interfaces';
import { Observable } from '../../observable';
import { Subscription } from '../../subscription';

export const debounceTime =
  <T>(dueTime: number, scheduler: SchedulerLike = asyncScheduler): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      let emittedValues: T[] = [];

      let schedule: Subscription<T> | undefined;

      const sourceSubscription = source.subscribe({
        next(value) {
          emittedValues = [];

          emittedValues.push(value);

          if (schedule) {
            schedule.unsubscribe();

            schedule = undefined;
          }

          if (!schedule) {
            schedule = scheduler.schedule<T>(() => {
              if (emittedValues.length > 0) subscriber.next(emittedValues.pop() as T);

              schedule = undefined;
            }, dueTime);

            sourceSubscription.add(schedule);
          }
        },
        error(error) {
          subscriber.error(error);

          emittedValues = [];
        },
        complete() {
          if (emittedValues.length > 0) subscriber.next(emittedValues.pop() as T);

          emittedValues = [];

          subscriber.complete();
        },
      });

      return () => {
        sourceSubscription.unsubscribe();

        emittedValues = [];
      };
    });
