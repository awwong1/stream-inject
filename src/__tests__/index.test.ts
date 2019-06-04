import { Readable } from "stream";
import { StreamInjector } from "..";

describe("string replaceValue", () => {
  describe("non-boundary", () => {
    it("should inject string using search string", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector("consectetur", "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Lorem ipsum dolor sit amet, replaced adipiscing elit.");
        done();
      });
    });

    it("should inject string using search regexp", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector(/efficitur/, "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris pretium mauris id leo efficitur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris pretium mauris id leo replaced bibendum.");
        done();
      });
    });

    it("should inject multiple strings using search string", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector("consectetur", "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem consectetur dolor sit amet, consectetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Lorem replaced dolor sit amet, replaced adipiscing elit.");
        done();
      });
    });

    it("should inject multiple strings using search regexp", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector(/efficitur/, "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris pretium efficitur id leo efficitur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris pretium replaced id leo replaced bibendum.");
        done();
      });
    });

    it("should preserve order on no match", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector(/efficitur/, "no match");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Vivamus ");
      readStream.push("lobortis purus ");
      readStream.push("in lectus egestas maximus.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Vivamus lobortis purus in lectus egestas maximus.");
        done();
      });

    });
  });

  describe("boundary", () => {
    it("should inject string using search string (boundary)", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector("consectetur", "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem ipsum dolor sit amet, conse");
      readStream.push("ctetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Lorem ipsum dolor sit amet, replaced adipiscing elit.");
        done();
      });
    });

    it("should inject string using search regexp (boundary)", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector(/efficitur/, "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris pretium mauris id leo effi");
      readStream.push("citur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris pretium mauris id leo replaced bibendum.");
        done();
      });
    });

    it("should inject multiple strings using search string (double boundary)", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector("consectetur", "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem consectetur");
      readStream.push(" dolor sit amet, conse");
      readStream.push("ctetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Lorem replaced dolor sit amet, replaced adipiscing elit.");
        done();
      });
    });

    it("should inject multiple strings using search regexp (double boundary)", done => {
      expect.assertions(1);
      const injectTransformer = new StreamInjector(/efficitur/, "replaced");

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris eff");
      readStream.push("icitu");
      readStream.push("r mauris id leo effi");
      readStream.push("citur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris replaced mauris id leo replaced bibendum.");
        done();
      });
    });

  });
});

describe("stream replaceValue", () => {
  describe("non-boundary", () => {
    it("should inject stream using search string", done => {
      expect.assertions(1);
      const replaceStream = new Readable({ read: () => undefined });
      replaceStream.push("replaced");
      replaceStream.push(null);
      const injectTransformer = new StreamInjector("consectetur", replaceStream);

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem ipsum dolor sit amet, consectetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Lorem ipsum dolor sit amet, replaced adipiscing elit.");
        done();
      });
    });

    it("should inject stream using search regexp", done => {
      expect.assertions(1);
      const replaceStream = new Readable({ read: () => undefined });
      replaceStream.push("replaced");
      replaceStream.push(null);
      const injectTransformer = new StreamInjector(/efficitur/, replaceStream);

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris pretium mauris id leo efficitur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris pretium mauris id leo replaced bibendum.");
        done();
      });
    });
  });

  describe("boundary", () => {
    it("should inject stream using search string (boundary)", done => {
      expect.assertions(1);
      const replaceStream = new Readable({ read: () => undefined });
      replaceStream.push("replaced");
      replaceStream.push(null);
      const injectTransformer = new StreamInjector("consectetur", replaceStream);

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem ipsum dolor sit amet, conse");
      readStream.push("ctetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Lorem ipsum dolor sit amet, replaced adipiscing elit.");
        done();
      });
    });

    it("should inject stream using search regexp (boundary)", done => {
      expect.assertions(1);
      const replaceStream = new Readable({ read: () => undefined });
      replaceStream.push("replaced");
      replaceStream.push(null);
      const injectTransformer = new StreamInjector(/efficitur/, replaceStream);

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris pretium mauris id leo effi");
      readStream.push("citur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris pretium mauris id leo replaced bibendum.");
        done();
      });
    });

    it("should inject stream once using search string (double boundary)", done => {
      expect.assertions(1);
      const replaceStream = new Readable({ read: () => undefined });
      replaceStream.push("replaced");
      replaceStream.push(null);
      const injectTransformer = new StreamInjector("consectetur", replaceStream);

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Lorem ipsum consectetur sit amet, conse");
      readStream.push("ctetur adipiscing elit.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        // Only the first instance of the search value should have been replaced
        expect(holder.join("")).toEqual("Lorem ipsum replaced sit amet, consectetur adipiscing elit.");
        done();
      });
    });

    it("should inject stream once using search regexp (double boundary)", done => {
      expect.assertions(1);
      const replaceStream = new Readable({ read: () => undefined });
      replaceStream.push("replaced");
      replaceStream.push(null);
      const injectTransformer = new StreamInjector(/efficitur/, replaceStream);

      const readStream = new Readable({ read: () => undefined });
      readStream.push("Mauris pretium efficitur id leo effi");
      readStream.push("citur bibendum.");
      readStream.push(null);
      const testStream = readStream.pipe(injectTransformer);

      const holder: string[] = [];
      testStream.on("data", (chunk: Buffer) => { holder.push(chunk.toString()); });
      testStream.on("end", () => {
        expect(holder.join("")).toEqual("Mauris pretium replaced id leo efficitur bibendum.");
        done();
      });
    });
  });

});
