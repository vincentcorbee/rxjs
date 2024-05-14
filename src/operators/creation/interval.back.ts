import { asyncScheduler } from '../../constants';
import { SchedulerLike } from '../../interfaces';
import { Observable } from '../../observable';
import { Subscriber } from '../../subscriber';

const schedule = (scheduler: SchedulerLike, subscriber: Subscriber<number>, period: number, itteration: number) => {
  const scheduleSubscription = scheduler.schedule(() => {
    subscriber.next(itteration);

    scheduleSubscription.add(schedule(scheduler, subscriber, period, itteration + 1));
  }, period);

  return scheduleSubscription;
};
export const interval = (period = 0, scheduler: SchedulerLike = asyncScheduler): Observable<number> =>
  new Observable((subscriber) => {
    const scheduleSubscription = schedule(scheduler, subscriber, period, 0);

    return () => scheduleSubscription.unsubscribe();
  });
