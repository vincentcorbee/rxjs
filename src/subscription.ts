export class Subscription<T> {
  private _teardownLogic: () => void;
  private _subscribed: boolean;
  _subscriptions: Set<Subscription<T>> = new Set();

  constructor(teardownLogic?: () => void) {
    this._subscribed = true;
    this._teardownLogic = teardownLogic ?? function () {};
  }

  add(subscription: Subscription<T>) {
    this._subscriptions.add(subscription);
  }

  unsubscribe() {
    if (this._subscribed) {
      this._subscribed = false;

      this._teardownLogic();

      this._subscriptions.forEach((subscription: Subscription<T>) => subscription.unsubscribe());

      this._subscriptions.clear();
    }
  }
}
