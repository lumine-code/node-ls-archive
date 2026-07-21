const archive = require('../src/ls-archive');
const path = require('path');

describe("tar files", () => {
  let fixturesRoot = null;

  beforeEach(() => fixturesRoot = path.join(__dirname, 'fixtures'));

  describe(".list()", () => {
    describe("when the archive file exists", () => {
      it("returns files in the tar archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-file.tar'), (error, tarPaths) => {
          expect(tarPaths.length).toBe(1);
          expect(tarPaths[0].path).toBe('file.txt');
          expect(tarPaths[0].isDirectory()).toBe(false);
          expect(tarPaths[0].isFile()).toBe(true);
          expect(tarPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      it("returns folders in the tar archive", (done) => {
        archive.list(path.join(fixturesRoot, 'one-folder.tar'), (error, tarPaths) => {
          expect(tarPaths.length).toBe(1);
          expect(tarPaths[0].path).toBe('folder');
          expect(tarPaths[0].isDirectory()).toBe(true);
          expect(tarPaths[0].isFile()).toBe(false);
          expect(tarPaths[0].isSymbolicLink()).toBe(false);
          done();
        });
      });

      describe("when the tree option is set to true", () => {
        describe("when the archive has no directory entries", () => {
          it("returns archive entries nested under their parent directory", (done) => {
            archive.list(path.join(fixturesRoot, 'no-dir-entries.tgz'), { tree: true }, (error, tree) => {
              expect(tree.length).toBe(1);
              expect(tree[0].getName()).toBe('package');
              expect(tree[0].getPath()).toBe('package');
              expect(tree[0].children.length).toBe(5);
              expect(tree[0].children[0].getName()).toBe('package.json');
              expect(tree[0].children[0].getPath()).toBe(path.join('package', 'package.json'));
              expect(tree[0].children[1].getName()).toBe('README.md');
              expect(tree[0].children[1].getPath()).toBe(path.join('package', 'README.md'));
              expect(tree[0].children[2].getName()).toBe('LICENSE.md');
              expect(tree[0].children[2].getPath()).toBe(path.join('package', 'LICENSE.md'));
              expect(tree[0].children[3].getName()).toBe('bin');
              expect(tree[0].children[3].getPath()).toBe(path.join('package', 'bin'));
              expect(tree[0].children[4].children[0].getName()).toBe('lister.js');
              expect(tree[0].children[4].children[0].getPath()).toBe(path.join('package', 'lib', 'lister.js'));
              expect(tree[0].children[4].children[1].getName()).toBe('ls-archive-cli.js');
              expect(tree[0].children[4].children[1].getPath()).toBe(path.join('package', 'lib', 'ls-archive-cli.js'));
              expect(tree[0].children[4].children[2].getName()).toBe('ls-archive.js');
              expect(tree[0].children[4].children[2].getPath()).toBe(path.join('package', 'lib', 'ls-archive.js'));
              expect(tree[0].children[4].children[3].getName()).toBe('reader.js');
              expect(tree[0].children[4].children[3].getPath()).toBe(path.join('package', 'lib', 'reader.js'));
              done();
            });
          });
        });

        describe("when the archive has multiple directories at the root", () => {
          it("returns archive entries nested under their parent directory", (done) => {
            archive.list(path.join(fixturesRoot, 'nested.tar'), { tree: true }, (error, tree) => {
              expect(tree.length).toBe(2);

              expect(tree[0].getPath()).toBe('d1');
              expect(tree[0].children[0].getName()).toBe('d2');
              expect(tree[0].children[0].children[0].getName()).toBe('d3');
              expect(tree[0].children[0].children[1].getName()).toBe('f1.txt');
              expect(tree[0].children[1].getName()).toBe('d4');
              expect(tree[0].children[2].getName()).toBe('f2.txt');

              expect(tree[1].getPath()).toBe('da');
              expect(tree[1].children[0].getName()).toBe('db');
              expect(tree[1].children[1].getName()).toBe('fa.txt');
              done();
            });
          });
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'not-a-file.tar'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid tar file", () => {
      it("calls back with an error", (done) => {
        archive.list(path.join(fixturesRoot, 'invalid.tar'), (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });

  describe(".readFile()", () => {
    describe("when the path exists in the archive", () => {
      it("calls back with the contents of the given path", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tar'), 'file.txt', (error, contents) => {
          expect(contents.toString()).toBe('hello\n');
          done();
        });
      });
    });

    describe("when the path does not exist in the archive", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-file.tar'), 'not-a-file.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path does not exist", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'not-a-file.tar'), 'not-a-file.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the archive path isn't a valid tar file", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'invalid.tar'), 'invalid.txt', (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });

    describe("when the path is a folder", () => {
      it("calls back with an error", (done) => {
        archive.readFile(path.join(fixturesRoot, 'one-folder.tar'), `folder${path.sep}`, (error) => {
          expect(error.message.length).toBeGreaterThan(0);
          done();
        });
      });
    });
  });
});
