require("./types");
const ExitError = require("./exit-error");

/**
 * @returns {Args}
 */
module.exports = function parseArgs() {
  let isDry = false;

  const argv = process.argv.slice(2); // clice off node and node's first arg
  if (argv.length < 3 || argv.length > 4) {
    throw new ExitError(
      ExitError.EXIT_INVALID_ARGS,
      `Invalid number of arguments. Expected 3 or 4 but received ${
        argv.length
      }.\n    ${argv.join("\n    ")}`
    );
  }

  if (argv.length === 4) {
    if (argv[0] !== "dry") {
      throw new ExitError(
        ExitError.EXIT_INVALID_ARGS,
        `With 4 arguments, the first myst be 'dry' but received '${argv[0]}' instead.`
      );
    }

    isDry = true;
    argv.shift();
  }

  const [globPattern, searchText, namePattern] = argv;

  let searchPattern;
  try {
    searchPattern = new RegExp(searchText, "m");
  } catch (err) {
    throw new ExitError(ExitError.EXIT_INVALID_ARGS, err.message);
  }

  if (!/\$\d/.test(namePattern)) {
    throw new ExitError(
      ExitError.EXIT_INVALID_ARGS,
      `Target file name pattern must include a capture reference such as $1 to match the first capture group or $0 to include the entire RegExp match`
    );
  }

  return {
    isDry,
    globPattern,
    searchPattern,
    namePattern,
  };
};
