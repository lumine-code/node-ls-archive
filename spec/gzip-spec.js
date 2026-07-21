const archive = require('../src/ls-archive');
const path = require('path');

describe("gzipped tar files", () => {
  let fixturesRoot = null;

  beforeEach(() => fixturesRoot = path.join(__dirname, 'fixtures'));

  describe(".list()", () => {
    describe("when the archive file exists", () => {
      it("returns files in a .tar.gz archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-file.tar.gz'), (error, gzipPaths) => {
          expect(gzipPaths.length).toBe(1);
          expect(gzipPaths[0].path).toBe('file.txt');
          expect(gzipPaths[0].isDirectory()).toBe(false);
          expect(gzipPaths[0].isFile()).toBe(true);
          expect(gzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns files in a .tgz archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-file.tgz'), (error, gzipPaths) => {
          expect(gzipPaths.length).toBe(1);
          expect(gzipPaths[0].path).toBe('file.txt');
          expect(gzipPaths[0].isDirectory()).toBe(false);
          expect(gzipPaths[0].isFile()).toBe(true);
          expect(gzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in a .tar.gz archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-folder.tar.gz'), (error, gzipPaths) => {
          expect(gzipPaths.length).toBe(1);
          expect(gzipPaths[0].path).toBe('folder');
          expect(gzipPaths[0].isDirectory()).toBe(true);
          expect(gzipPaths[0].isFile()).toBe(false);
          expect(gzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in a .tgz archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-folder.tgz'), (error, gzipPaths) => {
          expect(gzipPaths.length).toBe(1);
          expect(gzipPaths[0].path).toBe('folder');
          expect(gzipPaths[0].isDirectory()).toBe(true);
          expect(gzipPaths[0].isFile()).toBe(false);
          expect(gzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'not-a-file.tar.gz'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid gzipped tar file", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'invalid.tar.gz'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the second to last extension isn't .tar", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'invalid.txt.gz'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });

  describe(".readFile()", () => {
    describe("when the path exists in the archive", () => {
      it("calls back with the contents from a .tar.gz archive", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tar.gz'), 'file.txt', (error, contents) => {
          expect(contents.toString()).toBe('hello\n');
          done();
        });
      });

      it("calls back with the contents from a .tgz archive", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tgz'), 'file.txt', (error, contents) => {
          expect(contents.toString()).toBe('hello\n');
          done();
        });
      });
    });

    describe("when the path does not exist in the archive", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tar.gz'), 'not-a-file.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'not-a-file.tar.gz'), 'not-a-file.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid gzipped tar file", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'invalid.tar.gz'), 'invalid.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the second to last extension isn't .tar", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'invalid.txt.gz'), 'invalid.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });

  describe(".readGzip()", () => {
    it("calls back with the string contents of the archive", (done) => {
      archive.readGzip(path.join(fixturesRoot, 'file.txt.gz'), (error, contents) => {
        expect(contents.toString()).toBe('hello\n');
        done();
      });
    });

    describe("when the archive path isn't a valid gzipped tar file", () => {
      it("calls back with an error", (done) => {
        archive.readGzip(path.join(fixturesRoot, 'invalid.tar.gz'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.readGzip(path.join(fixturesRoot, 'not-a-file.tar.gz'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });
});
