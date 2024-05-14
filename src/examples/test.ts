import { Observable, from } from '../';

import { takeUntil, tap, distinct, reduce, take, map, filter } from '../operators';

// RxJS v6+
const obj1 = { id: 3, name: 'name 1' };
const obj2 = { id: 4, name: 'name 2' };
const obj3 = { id: 3, name: 'name 3' };

const vals = [obj1, obj2, obj3];

from(vals)
  .pipe(
    distinct((e) => {
      return e.id;
    }),
  )
  .subscribe(console.log);

/*
OUTPUT:
{id: 3, name: "name 1"}
{id: 4, name: "name 2"}
 */

// RxJS v6+

//emit ({name: 'Joe', age: 31}, {name: 'Bob', age:25})
const sourceFilter = from([
  { name: 'Joe', age: 31 },
  { name: 'Bob', age: 25 },
]);
//filter out people with age under 30
const example = sourceFilter.pipe(filter((person) => person.age >= 30));
//output: "Over 30: Joe"
const subscribe = example.subscribe((value) => console.log(`Over 30: ${value.name}`));

// RxJS v6+
// of(1, 1, 2, 2, 2, 1, 2, 3, 4, 3, 2, 1).pipe(
//   distinct(),
//   tap(console.log),
//   reduce((acc: number, value: number) => acc + val)
// )
// .subscribe(x => console.log(x)); // 10

// RxJS v6+
// console.time('timer')

// const timer1 = interval(1000).pipe(
//   take(10),
//   map(val => `timer1 ${val}`)
// )
// const timer2 = interval(2000).pipe(
//   take(6),
//   map(val => `timer2 ${val}`)
// )
// const timer3 = interval(500).pipe(
//   take(10),
//   map(val => `timer3 ${val}`)
// )
// const timer4 = interval(1000).pipe(take(10), map(val => `timer4 ${val}`));
// const timer5 = interval(1000).pipe(take(10), map(val => `timer5 ${val}`));

// const concurrent = 2 // the argument

// const merged = merge(timer1, timer2, timer3, concurrent)

// merged.subscribe(
//   x => {
//     ;`${console.log(x)} ${console.timeLog('timer')}`
//   },
//   null,
//   () => console.log('completed')
// )

// const source = from(new Promise((resolve) => resolve('foo')))

// const clicks = fromEvent(document, 'click')
// const result = source.pipe(tap(console.log), takeUntil(clicks))

// result.subscribe(console.log)

// const observable = new Observable(subscriber => {
//   let intervalue: any

//   try {
//     interval = setInterval(() => subscriber.next(Math.floor(Math.random() * 10)), 2000)
//   } catch (err) {
//     subscriber.error(err)
//   }

//   return () => {
//     if (interval) {
//       clearInterval(interval)
//     }
//   }
// })

// const subscription = interval(2000)
//   .pipe(
//     tap((value: number) => console.log(`before map ${value}`)),
//     map((value: number) => value * 2),
//     take(5),
//     tap((value: number) => console.log(`before filter ${value}`)),
//     filter((value: number) => value % 2 === 0)
//   )
//   .subscribe(
//     x => console.log(x),
//     null,
//     () => console.log('completed')
// )

// const sub2 = fromEvent(document, 'click')
//   .pipe(
//     map((event: MouseEvent) => ({
//       x: event.clientX,
//       y: event.clientY,
//     }))
//   )
//   .subscribe((value: any) => console.log(value))
