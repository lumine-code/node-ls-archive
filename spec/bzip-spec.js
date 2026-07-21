const archive = require('../src/ls-archive');
const path = require('path');

describe("bzipped tar files", () => {
  let fixturesRoot = null;

  beforeEach(() => fixturesRoot = path.join(__dirname, 'fixtures'));

  describe(".list()", () => {
    describe("when the archive file exists", () => {
      it("returns files in a .tar.bz2 archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-file.tar.bz2'), (error, bzipPaths) => {
          expect(bzipPaths.length).toBe(1);
          expect(bzipPaths[0].path).toBe('file.txt');
          expect(bzipPaths[0].isDirectory()).toBe(false);
          expect(bzipPaths[0].isFile()).toBe(true);
          expect(bzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns files in a .tbz archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-file.tbz'), (error, bzipPaths) => {
          expect(bzipPaths.length).toBe(1);
          expect(bzipPaths[0].path).toBe('file.txt');
          expect(bzipPaths[0].isDirectory()).toBe(false);
          expect(bzipPaths[0].isFile()).toBe(true);
          expect(bzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns files in a .tbz2 archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-file.tbz2'), (error, bzipPaths) => {
          expect(bzipPaths.length).toBe(1);
          expect(bzipPaths[0].path).toBe('file.txt');
          expect(bzipPaths[0].isDirectory()).toBe(false);
          expect(bzipPaths[0].isFile()).toBe(true);
          expect(bzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in a .tar.bz2 archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-folder.tar.bz2'), (error, bzipPaths) => {
          expect(bzipPaths.length).toBe(1);
          expect(bzipPaths[0].path).toBe('folder');
          expect(bzipPaths[0].isDirectory()).toBe(true);
          expect(bzipPaths[0].isFile()).toBe(false);
          expect(bzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in a .tbz archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-folder.tbz'), (error, bzipPaths) => {
          expect(bzipPaths.length).toBe(1);
          expect(bzipPaths[0].path).toBe('folder');
          expect(bzipPaths[0].isDirectory()).toBe(true);
          expect(bzipPaths[0].isFile()).toBe(false);
          expect(bzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in a .tbz2 archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-folder.tbz2'), (error, bzipPaths) => {
          expect(bzipPaths.length).toBe(1);
          expect(bzipPaths[0].path).toBe('folder');
          expect(bzipPaths[0].isDirectory()).toBe(true);
          expect(bzipPaths[0].isFile()).toBe(false);
          expect(bzipPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'not-a-file.tar.bz2'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid bzipped tar file", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'invalid.tar.bz2'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the second to last extension isn't .tar", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'invalid.txt.bz2'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });

  describe(".readFile()", () => {
    describe("when the path exists in the archive", () => {
      it("calls back with the contents from a .tar.bz2 archive", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tar.bz2'), 'file.txt', (error, contents) => {
          expect(contents.toString()).toBe('hello\n');
          done();
        });
      });

      it("calls back with the contents from a .tbz archive", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tbz'), 'file.txt', (error, contents) => {
          expect(contents.toString()).toBe('hello\n');
          done();
        });
      });

      it("calls back with the contents from a .tbz2 archive", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tbz2'), 'file.txt', (error, contents) => {
          expect(contents.toString()).toBe('hello\n');
          done();
        });
      });
    });

    describe("when the path does not exist in the archive", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tar.bz2'), 'not-a-file.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'not-a-file.tar.bz2'), 'not-a-file.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid bzipped tar file", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'invalid.tar.bz2'), 'invalid.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the second to last extension isn't .tar", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'invalid.txt.bz2'), 'invalid.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });

  describe(".readBzip()", () => {
    it("calls back with the string contents of the archive", (done) => {
      archive.readBzip(path.join(fixturesRoot, 'file.txt.bz2'), (error, contents) => {
        expect(contents.toString()).toBe('hello\n');
        done();
      });
    });

    describe("when the archive path isn't a valid bzipped tar file", () => {
      it("calls back with an error", (done) => {
        archive.readBzip(path.join(fixturesRoot, 'invalid.tar.bz2'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.readBzip(path.join(fixturesRoot, 'not-a-file.tar.bz2'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });
});
