import { of, distinctUntilChanged } from '../';

const totallyDifferentBuilds$ = of(
  { engineVersion: '1.1.0', transmissionVersion: '1.2.0' },
  { engineVersion: '1.1.0', transmissionVersion: '1.4.0' },
  { engineVersion: '1.3.0', transmissionVersion: '1.4.0' },
  { engineVersion: '1.3.0', transmissionVersion: '1.5.0' },
  { engineVersion: '2.0.0', transmissionVersion: '1.5.0' },
).pipe(
  distinctUntilChanged((prev, curr) => {
    return prev.engineVersion === curr.engineVersion || prev.transmissionVersion === curr.transmissionVersion;
  }),
);

totallyDifferentBuilds$.subscribe(console.log);

// Logs:
// { engineVersion: '1.1.0', transmissionVersion: '1.2.0' }
// { engineVersion: '1.3.0', transmissionVersion: '1.4.0' }
// { engineVersion: '2.0.0', transmissionVersion: '1.5.0' }
