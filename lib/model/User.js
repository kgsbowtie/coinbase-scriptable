const BaseModel   = importModule('./BaseModel');
const handleError = importModule('../errorHandler').handleError;

class User extends BaseModel {
  constructor(client, data) {
    if (!(this instanceof User)) {
      return new User(client, data);
    }
    super(client, data);
  }

  update(args, callback) {
    const self = this;
    if (!self.client) {throw "no client";}
    if (!self.id) {
      callback(new Error("no user id"), null);
      return;
    }

    const path = 'user';

    self.client._putHttp(path, args, function onPut(err, result) {
      if (!handleError(err, result, callback)) {
        callback(null, new User(self.client, result.data));
      }
    });
  }

  showAuth(callback) {
    const self = this;
    if (!self.client) {throw "no client";}
    if (!self.id) {
      callback(new Error("no user id"), null);
      return;
    }

    const path = 'user/auth';

    self.client._getHttp(path, null, function onGet(err, result) {
      if (!handleError(err, result, callback)) {
        callback(null, result.data);
      }
    });
  }
}

module.exports = User;
