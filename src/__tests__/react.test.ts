// tslint:disable: no-implicit-dependencies
import { createReadStream } from "fs";
import { join } from "path";
import { createElement } from "react";
import { renderToNodeStream } from "react-dom/server";
import { StreamInjector } from "..";
import { StubComponent } from "./stub";

describe("combination", () => {
  it("should handle a basic react ssr workflow", done => {
    expect.assertions(1);
    const htmlPath = join(__dirname, "test.html");
    const htmlStream = createReadStream(htmlPath, { encoding: "utf8" });
    const reactStream = renderToNodeStream(createElement(StubComponent));

    const testStream = htmlStream
      .pipe(new StreamInjector("{body}", reactStream))
      .pipe(new StreamInjector("{reduxStateCode}", (
        "<script>window.__PRELOADED_REDUX_DATA__= " +
        JSON.stringify({ a: 1 }).replace(/</g, "\\u003c") +
        "</script>"
      )));

    const holder: string[] = [];
    testStream.on("data", (chunk: Buffer) => holder.push(chunk.toString()));
    testStream.on("end", () => {
      expect(holder.join("")).toMatchSnapshot();
      done();
    });
  });
});
