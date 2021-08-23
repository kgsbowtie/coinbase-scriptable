const BaseModel   = importModule('./BaseModel');
const handleError = importModule('../errorHandler').handleError;

class Transfer extends BaseModel {
  constructor(client, data, account) {
    if (!(this instanceof Transfer)) {
      return new Transfer(client, data, account);
    }
    super(client, data);
    if (!account) { throw new Error("no account arg"); }
    if (!account.id) { throw new Error("account has no id"); }
    this.account = account;
  }

  _commit({colName, ObjFunc}, callback) {
    const self = this;

    const path = `accounts/${self.account.id}/${colName}/${self.id}/commit`;

    self.client._postHttp(path, null, function onPut(err, result) {
      if (!handleError(err, result, callback)) {
        callback(null, new ObjFunc(self.client, result.data, self.account));
      }
    });
  }
}

module.exports = Transfer;

