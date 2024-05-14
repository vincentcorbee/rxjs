import { asyncScheduler } from '../../constants';
import { SchedulerLike } from '../../interfaces';
import { Observable } from '../../observable';
import { Subscriber } from '../../subscriber';

const schedule = (scheduler: SchedulerLike, subscriber: Subscriber<number>, period: number, itteration: number, state: { subscribed: boolean }) => {
  const scheduleSubscription = scheduler.schedule(() => {
    if (!state.subscribed) return;

    subscriber.next(itteration);

    scheduleSubscription.add(schedule(scheduler, subscriber, period, itteration + 1, state));
  }, period);

  return scheduleSubscription;
};

export const interval = (period = 0, scheduler: SchedulerLike = asyncScheduler): Observable<number> =>
  new Observable((subscriber) => {
    const state = { subscribed: true };
    const scheduleSubscription = schedule(scheduler, subscriber, period, 0, state);

    return () => {
      state.subscribed = false;

      scheduleSubscription.unsubscribe();
    };
  });
