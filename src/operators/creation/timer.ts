import { Observable } from '../../observable';

/*
  InitialDelay and period is in milliseconds
*/
export const timer = (initialDelay: number, period?: number) =>
  new Observable<number>((subscriber) => {
    let itteration = 0;

    let intervalId: any;

    const callback = () => {
      itteration++;

      subscriber.next(itteration - 1);

      if (itteration === 1 && period) intervalId = setInterval(callback, period);
    };

    const timeoutId = setTimeout(callback, initialDelay);

    return () => {
      if (intervalId) clearInterval(intervalId);

      clearTimeout(timeoutId);
    };
  });
