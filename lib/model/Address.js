const BaseModel   = importModule('./BaseModel'); // importModule('lodash');
const Transaction = importModule('./Transaction');
const handleError = importModule('../errorHandler').handleError;
const _           = Object;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Address = importModule('coinbase').model.Address;
// var myAddress = new Address(client, data, account);
//```
// _normally you will get address from `Address` methods on the Account
// or methods on existing instance of `Address`_
// - - -

class Address extends BaseModel {
  constructor(client, data, account) {
    if (!(this instanceof Address)) {
      return new Address(client, data, account);
    }
    super(client, data);
    if (!account) { throw new Error("no account arg"); }
    if (!account.id) { throw new Error("account has no id"); }
    this.account = account;
  }

  getTransactions(args, callback) {
    const opts = {
      'colName'  : `addresses/${this.id}/transactions`,
      'ObjFunc'  : Transaction,
    };

    this.account._getAll(_.assign(args || {}, opts), callback)
  }
}

module.exports = Address;
