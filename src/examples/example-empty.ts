import { EMPTY, startWith } from '../';

const result = EMPTY.pipe(startWith(7));

result.subscribe((x) => console.log(x));

// Outputs
// 7
