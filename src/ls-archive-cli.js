const path = require("path");
const { parseArgs, styleText } = require("util");
const archive = require("./ls-archive.js");

const USAGE = `Usage: lsa [file ...]

List the files and folders inside an archive file.

Supports .zip, .tar, .tar.gz, .tgz, .tar.bz2, .tbz and .tbz2 files.

Options:
  --no-colors   Disable colored output
  -h, --help    Show this message`;

module.exports = function () {
  // optimist auto-handled `--no-colors`; util.parseArgs has no boolean negation,
  // so strip it out of the argument list and track it ourselves.
  const rawArgs = process.argv.slice(2);
  const noColors = rawArgs.includes("--no-colors");
  const args = rawArgs.filter((arg) => arg !== "--no-colors");

  let values, positionals;
  try {
    ({ values, positionals } = parseArgs({
      args,
      allowPositionals: true,
      options: {
        help: { type: "boolean", short: "h", default: false },
      },
    }));
  } catch (error) {
    console.error(error.message);
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  if (values.help) {
    console.log(USAGE);
    return;
  }
  if (positionals.length === 0) {
    console.error(USAGE);
    process.exitCode = 1;
    return;
  }

  const useColors = !noColors && process.stdout.isTTY;
  const paint = (text, color) => (useColors ? styleText(color, text) : text);

  // Process archives one at a time, preserving the input order.
  const listNext = (index) => {
    if (index >= positionals.length) {
      return;
    }
    const archivePath = path.resolve(process.cwd(), positionals[index]);
    archive.list(archivePath, (error, files) => {
      if (error != null) {
        console.error(paint(`Error reading: ${archivePath}`, "red"));
      } else {
        console.log(`${paint(archivePath, "cyan")} (${files.length})`);
        for (let i = 0; i < files.length; i++) {
          const prefix = i === files.length - 1 ? "└── " : "├── ";
          console.log(`${prefix}${files[i].getPath()}`);
        }
        console.log();
      }
      listNext(index + 1);
    });
  };

  listNext(0);
};
