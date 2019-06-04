# stream-inject

[![CircleCI](https://circleci.com/gh/awwong1/stream-inject.svg?style=svg)](https://circleci.com/gh/awwong1/stream-inject)
[![codecov](https://codecov.io/gh/awwong1/stream-inject/branch/master/graph/badge.svg)](https://codecov.io/gh/awwong1/stream-inject)

A zero dependency, strictly typed [Transform stream](https://nodejs.org/api/stream.html#stream_class_stream_transform) for mid-stream injections.

Supports replace by string and regular expression.

```bash
npm install stream-inject
```

## Usage

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

More complicated stream replacement logic can be done by taking advantage stream pipes.

```typescript
import { join } from "path";
import { createReadStream } from "fs";
import { createElement } from "react";
import { renderToNodeStream } from "react-dom/server";
import { StreamInjector } from "..";

// ...
const htmlPath = join(__dirname, "index.html");
const htmlStream = createReadStream(htmlPath, { encoding: "utf8" });
const reactStream = renderToNodeStream(createElement(MyReactComponent));

// express (req, res) => { ...
const testStream = htmlStream
  .pipe(new StreamInjector("{body}", reactStream))
  .pipe(new StreamInjector("{reduxStateCode}", (
    "<script>window.__PRELOADED_REDUX_DATA__= " +
    JSON.stringify({ a: 1 }).replace(/</g, "\\u003c") +
    "</script>"
  )))
  .pipe(res);
```

## LICENSE

[MIT License](LICENSE)
