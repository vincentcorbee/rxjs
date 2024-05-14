// RxJS v6+
import { Subject, from } from '../';

const sub = new Subject<number>();

sub.next(1);
sub.subscribe((x) => {
  console.log('Subscriber A', x);
});

sub.next(2); // OUTPUT => Subscriber A 2

const sub2 = sub.subscribe((x) => {
  console.log('Subscriber B', x);
});

sub.next(3); // OUTPUT => Subscriber A 3, Subscriber B 3 (logged from both subscribers)

const subject = new Subject<number>();

subject.subscribe({
  next: (v) => console.log('observerA: ' + v),
});
subject.subscribe({
  next: (v) => console.log('observerB: ' + v),
});

var observable = from([1, 2, 3]);

observable.subscribe(subject); // You can subscribe providing a Subject
