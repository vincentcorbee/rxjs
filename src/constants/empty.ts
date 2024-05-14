import { Observable } from '../observable';

export const EMPTY = new Observable<never>((subscribe) => subscribe.complete());
