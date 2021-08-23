const BaseModel   = importModule('./BaseModel');
const handleError = importModule('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Transaction = importModule('coinbase').model.Transaction;
// var myTxn = new Transaction(client, data, account);
//```
// _normally you will get transactions from `Transaction` methods on the Account
// or methods on existing instance of `Transaction`_
// - - -
class Transaction extends BaseModel {
  constructor(client, data, account) {
    if (!(this instanceof Transaction)) {
      return new Transaction(client, data, account);
    }
    super(client, data);
    if (!account) { throw new Error("no account arg"); }
    if (!account.id) { throw new Error("account has no id"); }
    this.account = account;
  }

  resend(callback) {
    const self = this;
    if (self.type !== 'request') {
      throw "Can only resend 'request' transactions";
    }

    const path = `accounts/${self.account.id}/transactions/${self.id}/resend`;

    self.client._postHttp(path, null, function onPut(err, result) {
      if (!handleError(err, result, callback)) {
        callback(null, result);
      }
    });
  }

  complete(callback) {
    const self = this;
    if (self.type !== 'request') {
      throw "Can only complete 'request' transactions";
    }

    const path = `accounts/${self.account.id}/transactions/${self.id}/complete`;

    self.client._postHttp(path, null, function onPut(err, result) {
      if (!handleError(err, result, callback)) {
        callback(null, new Transaction(self.client, result.data, self.account));
      }
    });
  }

  cancel(callback) {
    const self = this;
    if (self.type !== 'request') {
      throw "Can only cancel 'request' transactions";
    }

    const path = `accounts/${self.account.id}/transactions/${self.id}`;

    self.client._deleteHttp(path, function onDel(err, result) {
      if (!handleError(err, result, callback)) {
        callback(null, result);
      }
    });
  }
}

module.exports = Transaction;

