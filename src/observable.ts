import { Subscriber } from './subscriber';
import { Subscription } from './subscription';
import { Observer, OperatorFunction } from './interfaces';

export class Observable<T> {
  protected _subscribe: any;

  constructor(subscribe: (subscriber: Subscriber<T>) => any) {
    this._subscribe = subscribe;
  }

  pipe(): Observable<T>;
  pipe<A>(op1: OperatorFunction<T, A>): Observable<A>;
  pipe<A, B>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>): Observable<B>;
  pipe<A, B, C>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>): Observable<C>;
  pipe<A, B, C, D>(op1: OperatorFunction<T, A>, op2: OperatorFunction<A, B>, op3: OperatorFunction<B, C>, op4: OperatorFunction<C, D>): Observable<C>;
  pipe(...operators: OperatorFunction<any, any>[]): Observable<any> {
    return operators.reduce((acc, operator) => operator(acc), this as Observable<T>);
  }

  subscribe(next?: Observer<T> | ((value: T) => void), error?: ((value: any) => void) | null, complete?: () => void): Subscription<T> {
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

    return new Subscription(this._subscribe(new Subscriber(observer)));
  }
}
