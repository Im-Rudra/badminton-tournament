class resError {
  constructor(message, errorType = null, redirect = null) {
    this.error = true;
    this.message = message;
    this.errorType = errorType;
    this.redirect = redirect;
  }
}

module.exports = resError;
