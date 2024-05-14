import { Observable } from '../../observable';

export const fromEvent = (element: HTMLElement | Document | Window, type: string): Observable<Event> =>
  new Observable<Event>((subscriber) => {
    const eventListener = (event: Event) => {
      try {
        subscriber.next(event);
      } catch (err) {
        subscriber.error(err);
      }
    };

    element.addEventListener(type, eventListener);

    return () => element.removeEventListener(type, eventListener);
  });
