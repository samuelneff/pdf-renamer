const fs = require("fs");
const ExitError = require("./exit-error");
const header = require("./header");
const parseArgs = require("./args-parser");
require("./types");

async function run() {
  const glob = require("glob");
  const readNewName = require("./read-new-name");

  /** @type {Args} */
  const args = parseArgs();

  const fileNames = glob.sync(args.globPattern);
  const newNames = await Promise.all(
    fileNames.map(async (name) => readNewName(name, args))
  );

  fileNames.forEach((name, index) => {
    const newName = newNames[index];
    if (!newName) {
      return;
    }
    console.log(`${name} -> ${newName}`);
    if (!args.isDry) {
      fs.renameSync(name, newName);
    }
  });
  return ExitError.EXIT_OK;
}

(async function () {
  let exitCode = ExitError.EXIT_OK;
  try {
    await run();
  } catch (err) {
    header();
    exitCode = err.exitCode || ExitError.EXIT_UNKNOWN;
    console.log(
      err.message.includes("Cannot find module")
        ? "Could not load dependencies. Be sure to run `npm install`."
        : err.message
    );
  }
  // immediately exiting could cause us to lose some final console output,
  // so wait 100 ms before exiting
  setTimeout(() => process.exit(exitCode), 100);
})();
