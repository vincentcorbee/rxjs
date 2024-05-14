import { Observable } from '../observable';
import { Observer } from '../interfaces';
import { Subscriber } from '../subscriber';
import { Subscription } from '../subscription';

export class Subject<T> extends Observable<T> {
  private subscriptions = new Map<Subscriber<T>, Subscription<T>>();

  constructor() {
    super((subscriber: Subscriber<T>) => () => {
      this.subscriptions.delete(subscriber);
    });
  }

  get observed() {
    return this.subscriptions.size > 0;
  }

  next(value: T) {
    this.subscriptions.forEach((_, observer) => {
      if (observer.next) observer.next(value);
    });
  }

  error(error: any) {
    this.subscriptions.forEach((_, observer) => {
      if (observer.error) observer.error(error);
    });
  }

  complete() {
    this.subscriptions.forEach((_, observer) => {
      if (observer.complete) observer.complete();
    });
  }

  subscribe(
    next?: Observer<T> | ((value: T) => void) | undefined,
    error?: ((value: any) => void) | null | undefined,
    complete?: (() => void) | undefined,
  ): Subscription<T> {
    let observer: Observer<T> = {};

    if (typeof next === 'object') {
      observer = next;
    } else if (typeof next === 'function') {
      observer = {
        next,
      };

      if (typeof error === 'function') observer.error = error;

      if (typeof complete === 'function') observer.complete = complete;
    }

    const subscriber = new Subscriber(observer);

    const subscription = new Subscription(this._subscribe(subscriber));

    this.subscriptions.set(subscriber, subscription);

    return subscription;
  }

  unsubscribe() {
    this.subscriptions.forEach((subscription) => subscription.unsubscribe);

    this.subscriptions = new Map();
  }
}
