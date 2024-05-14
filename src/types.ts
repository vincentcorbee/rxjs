import { Observable } from './observable';

export type ObservableInput<T> = Observable<T> | AsyncIterable<T> | PromiseLike<T> | ArrayLike<T> | Iterable<T>;

export type ObservedValueOf<O> = O extends ObservableInput<infer T> ? T : never;
