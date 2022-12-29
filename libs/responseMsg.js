class ResponseMsg {
  constructor(isErr, msg) {
    this.error = isErr;
    this.message = msg;
  }
}

module.exports = ResponseMsg;
