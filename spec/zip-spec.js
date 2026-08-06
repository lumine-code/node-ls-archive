const archive = require("../src/ls-archive");
const path = require("path");

describe("zip files", () => {
  let fixturesRoot = null;

  beforeEach(() => (fixturesRoot = path.join(__dirname, "fixtures")));

  describe(".list()", () => {
    describe("when the archive file exists", () => {
      it("returns files in the zip archive", (done) => {
        archive.list(path.join(fixturesRoot, "one-file.zip"), (error, zipPaths) => {
          expect(zipPaths.length).toBe(1);
          expect(zipPaths[0].path).toBe("file.txt");
          expect(zipPaths[0].isDirectory()).toBe(false);
          expect(zipPaths[0].isFile()).toBe(true);
          expect(zipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in the zip archive", (done) => {
        archive.list(path.join(fixturesRoot, "one-folder.zip"), (error, zipPaths) => {
          expect(zipPaths.length).toBe(1);
          expect(zipPaths[0].path).toBe("folder");
          expect(zipPaths[0].isDirectory()).toBe(true);
          expect(zipPaths[0].isFile()).toBe(false);
          expect(zipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      describe("when the tree option is set to true", () => {
        it("returns archive entries nested under their parent directory", (done) => {
          archive.list(path.join(fixturesRoot, "nested.zip"), { tree: true }, (error, tree) => {
            expect(tree.length).toBe(2);

            expect(tree[0].getPath()).toBe("d1");
            expect(tree[0].children[0].getName()).toBe("d2");
            expect(tree[0].children[0].children[0].getName()).toBe("d3");
            expect(tree[0].children[0].children[1].getName()).toBe("f1.txt");
            expect(tree[0].children[1].getName()).toBe("d4");
            expect(tree[0].children[2].getName()).toBe("f2.txt");

            expect(tree[1].getPath()).toBe("da");
            expect(tree[1].children[0].getName()).toBe("db");
            expect(tree[1].children[1].getName()).toBe("fa.txt");
            done();
          });
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, "not-a-file.zip"), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid zip file", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, "invalid.zip"), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });

  describe(".readFile()", () => {
    describe("when the path exists in the archive", () => {
      it("calls back with the contents of the given path", (done) => {
        archive.readFile(path.join(fixturesRoot, "one-file.zip"), "file.txt", (error, contents) => {
          expect(contents.toString()).toBe("hello\n");
          done();
        });
      });
    });

    describe("when the path does not exist in the archive", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, "one-file.zip"), "not-a-file.txt", (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, "not-a-file.zip"), "not-a-file.txt", (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid zip file", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, "invalid.zip"), "invalid.txt", (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the path is a folder", () => {
      it("calls back with an error", (done) => {
        archive.readFile(
          path.join(fixturesRoot, "one-folder.zip"),
          `folder${path.sep}`,
          (error) => {
            expect(error.message.length).toBeGreaterThan(0);
            done();
          },
        );
      });
    });

    describe("when the archive contains nested directories", () => {
      it("calls back with the contents of the given path", (done) => {
        archive.readFile(
          path.join(fixturesRoot, "nested.zip"),
          `d1${path.sep}d2${path.sep}f1.txt`,
          (error, contents) => {
            expect(contents.toString()).toBe("");
            done();
          },
        );
      });
    });
  });
});
