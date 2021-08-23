const Transfer    = importModule('./Transfer');
const handleError = importModule('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Deposit = importModule('coinbase').model.Deposit;
// var myDeposit = new Deposit(client, data, account);
//```
// - - -
class Deposit extends Transfer {
  constructor(client, data, account) {
    if (!(this instanceof Deposit)) {
      return new Deposit(client, data, account);
    }
    super(client, data, account);
  }

  commit(callback) {

    const opts = {
      'colName' : 'deposits',
      'ObjFunc' : Deposit
    };

    this._commit(opts, callback);
  }
}

module.exports = Deposit;
