import { Observer } from './interfaces';

export class Subscriber<T> implements Observer<T> {
  private _observer: Observer<T>;
  private _completed = false;
  private _errored = false;

  constructor(observer: Observer<T>) {
    this._observer = observer;
  }

  next(value: T) {
    try {
      !this._completed && !this._errored && this._observer.next && this._observer.next(value);
    } catch (error: any) {
      this.error(error);
    }
  }

  error(error: any) {
    if (!this._completed && !this._errored) {
      this._errored = true;
      this._observer.error && this._observer.error(error);
    }
  }

  complete() {
    if (!this._completed && !this._errored) {
      this._completed = true;

      this._observer.complete && this._observer.complete();
    }
  }
}
