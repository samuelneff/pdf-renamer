class ExitError extends Error {
  constructor(exitCode, message) {
    super(message);
    this.exitCode = exitCode;
  }
}

ExitError.EXIT_OK = 0;
ExitError.EXIT_INVALID_ARGS = 1;
ExitError.EXIT_IO = 2;
ExitError.EXIT_PDF = 3;
ExitError.EXIT_NEED_INSTALL = 254;
ExitError.EXIT_UNKNOWN = 255;

module.exports = ExitError;
