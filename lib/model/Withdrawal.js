const Transfer    = importModule('./Transfer');
const handleError = importModule('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Withdrawal = require('coinbase').model.Withdrawal;
// var myWithdrawal = new Withdrawal(client, data, account);
//```
// - - -
class Withdrawal extends Transfer {
  constructor(client, data, account) {
    if (!(this instanceof Withdrawal)) {
      return new Withdrawal(client, data, account);
    }
    super(client, data, account);
  }

  commit(callback) {

    const opts = {
      'colName' : 'withdrawals',
      'ObjFunc' : Withdrawal
    };

    this._commit(opts, callback);
  }
}

module.exports = Withdrawal;
