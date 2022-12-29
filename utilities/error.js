const makeError = (message = '', status = 200) => {
  const error = new Error(message);
  error.status = status;
  error.message = message;
  return error;
};

module.exports = makeError;
