import { Stream, Transform } from "stream";

// tslint:disable-next-line: interface-name
interface StreamInjectorOptions {
  encoding?: BufferEncoding;
}

export class StreamInjector extends Transform {
  private chunksStack: string[] = [];
  private searchValue: string | RegExp;
  private replaceValue: string | Stream;
  private injectOptions: StreamInjectorOptions;
  private overlapWindow: number;
  private streamReplaced: boolean;

  constructor(searchValue: string | RegExp, replaceValue: string | Stream, injectOptions?: StreamInjectorOptions) {
    super();
    this.searchValue = searchValue;
    this.replaceValue = replaceValue;
    this.injectOptions = injectOptions || {};

    // maximum number of characters to check for search value overlap
    this.overlapWindow = searchValue.toString().length;
    // set an instance flag for already replaced stream
    this.streamReplaced = false;
  }

  public _transform(chunk: any, _: string, callback: (error?: Error | null | undefined, data?: any) => void) {
    const { encoding } = this.injectOptions;
    let streamCallbackInterrupted = false;

    if (!Buffer.isBuffer(chunk)) {
      throw new TypeError(`Uninjectable type: ${typeof chunk}`);
    }

    let chunkStr = chunk.toString(encoding);
    let data: Buffer | undefined;
    while (this.chunksStack.length) {
      chunkStr = this.chunksStack.pop() + chunkStr;
    }

    const matchIndex = chunkStr.search(this.searchValue);
    if (matchIndex >= 0) {
      const chunkFragments = chunkStr.split(this.searchValue);
      let carryOver = true;
      if (typeof this.replaceValue === "string") {
        const lastFragment = chunkFragments[chunkFragments.length - 1];
        const replChunk = chunkFragments.join(this.replaceValue);
        const cap = replChunk.lastIndexOf(lastFragment);
        data = Buffer.from(replChunk.slice(0, cap), encoding);
        this.chunksStack.push(lastFragment);
        carryOver = false;
      } else if (!this.streamReplaced) {
        data = Buffer.from(chunkFragments[0], encoding);
        this.push(data);
        streamCallbackInterrupted = true;
        this.streamReplaced = true;
        this.replaceValue.on("data", (replChunk) => this.push(replChunk));
        this.replaceValue.on("end", () => callback(null));
      } else {
        data = Buffer.from(chunkStr, encoding);
        carryOver = false;
      }

      if (carryOver && chunkFragments.length > 1 && chunkFragments[1] !== "") {
        const carryOverIndex = chunkStr.indexOf(chunkFragments[1], matchIndex);
        this.chunksStack.push(chunkStr.slice(carryOverIndex));
      }
    } else {
      const pivot = (chunkStr.length - this.overlapWindow);
      if (pivot > 0) {
        const sendFragment = chunkStr.slice(0, pivot);
        data = Buffer.from(sendFragment, encoding);
        this.chunksStack.push(chunkStr.slice(pivot));
      } else {
        this.chunksStack.push(chunkStr);
      }
    }

    if (!streamCallbackInterrupted) {
      callback(null, data);
    }
  }

  public _flush(callback: (error?: Error | null | undefined, data?: any) => void) {
    while (this.chunksStack.length) {
      const currentChunkString = this.chunksStack.pop();
      if (currentChunkString) {
        this.push(Buffer.from(currentChunkString, this.injectOptions.encoding));
      }
    }
    callback(null);
  }
}
