import { SchedulerLike } from '../interfaces';
import { Subscription } from '../subscription';

export class AsapScheduler implements SchedulerLike {
  schedule(action: () => void, delay = 0) {
    if (delay === 0) {
      let isCancelled = false;

      const promise = Promise.resolve();

      promise.then(() => !isCancelled && action());

      return new Subscription(() => (isCancelled = true));
    } else {
      const timeoutId = setTimeout(action, delay);

      return new Subscription(() => clearTimeout(timeoutId));
    }
  }
}
