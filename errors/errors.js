const BAD_REQUEST = 400;
const SERVER_ERROR = 500;
const STATUS_CREATED = 201;
const STATUS_OK = 200;

class NotFound extends Error {
  constructor(message) {
    super(message);
    this.status = 404;
    this.name = 'notFound';
  }
}

module.exports = {
  BAD_REQUEST,
  SERVER_ERROR,
  NotFound,
  STATUS_CREATED,
  STATUS_OK,
};
