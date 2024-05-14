import { defaultIfEmpty } from '../operators';
import { of } from '../';

//emit 'Observable.of() Empty!' when empty, else any values from source
const exampleOne = of().pipe(defaultIfEmpty('Observable.of() Empty!'));
//output: 'Observable.of() Empty!'
const subscribe = exampleOne.subscribe((value) => console.log(value));
