# stream-inject

[![CircleCI](https://circleci.com/gh/awwong1/stream-inject.svg?style=svg)](https://circleci.com/gh/awwong1/stream-inject)
[![codecov](https://codecov.io/gh/awwong1/stream-inject/branch/master/graph/badge.svg)](https://codecov.io/gh/awwong1/stream-inject)

Inject values (`string`, `Stream`) into a NodeJS Stream. Supports replace by string and regular expression.

```bash
npm install stream-inject
```

```typescript
import { Readable } from "stream";
import { StreamInjector } from "stream-inject";

const injectTransformer = new StreamInjector("consectetur", "replaced");

const readStream = new Readable({ read: () => undefined });
readStream.push("Lorem consectetur dolor sit amet, consectetur adipiscing elit.");
readStream.push(null);

readStream.pipe(injectTransformer).pipe(process.stdout);
// Lorem replaced dolor sit amet, replaced adipiscing elit.
```

## LICENSE

[MIT License](LICENSE)
