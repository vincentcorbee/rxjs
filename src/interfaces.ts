import { Observable } from './observable';
import { Subscription } from './subscription';

export interface Observer<T> {
  next?: (value: T) => void;
  error?: (err: any) => void;
  complete?: () => void;
}

export interface UnaryFunction<T, R> {
  (source: T): R;
}

export interface OperatorFunction<T, R> extends UnaryFunction<Observable<T>, Observable<R>> {}

export interface MonoTypeOperatorFunction<T> extends OperatorFunction<T, T> {}

export interface RetryConfig {
  count?: number;
}

export interface SchedulerLike {
  schedule<T>(work: () => void, delay: number): Subscription<T>;
}
