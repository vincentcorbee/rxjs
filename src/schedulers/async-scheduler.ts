import { SchedulerLike } from '../interfaces';
import { Subscription } from '../subscription';

export class AsyncScheduler implements SchedulerLike {
  schedule(action: () => void, delay = 0) {
    const timeoutId = setTimeout(action, delay);

    return new Subscription(() => clearTimeout(timeoutId));
  }
}
