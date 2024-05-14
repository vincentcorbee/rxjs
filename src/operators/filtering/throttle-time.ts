import { asyncScheduler } from '../../constants';
import { MonoTypeOperatorFunction, SchedulerLike } from '../../interfaces';
import { Observable } from '../../observable';
import { Subscription } from '../../subscription';

export const throttleTime =
  <T>(dueTime: number, scheduler: SchedulerLike = asyncScheduler): MonoTypeOperatorFunction<T> =>
  (source) =>
    new Observable((subscriber) => {
      let started = false;

      let unsubscribed = false;

      let scheduledSubscription: Subscription<T> | undefined;

      const sourceSubscription = source.subscribe({
        next(value) {
          if (unsubscribed) return;

          if (!started) {
            started = true;

            subscriber.next(value);
          } else if (!scheduledSubscription) {
            scheduledSubscription = scheduler.schedule<T>(() => {
              started = false;

              scheduledSubscription = undefined;
            }, dueTime);

            sourceSubscription.add(scheduledSubscription);
          }
        },
        error(error) {
          subscriber.error(error);

          scheduledSubscription?.unsubscribe();
        },
        complete() {
          subscriber.complete();

          scheduledSubscription?.unsubscribe();
        },
      });

      return () => {
        sourceSubscription.unsubscribe();

        unsubscribed = true;
      };
    });
