//
// The Account object is the primary abstraction to the Conbase API.
//
const AccountBase = importModule('./AccountBase'); //importModule('lodash');
const handleError = importModule('../errorHandler').handleError;
const Address     = importModule('./Address');
const Transaction = importModule('./Transaction');
const Buy         = importModule('./Buy');
const Sell        = importModule('./Sell');
const Deposit     = importModule('./Deposit');
const Withdrawal  = importModule('./Withdrawal');
const _           = Object;

//
// ##CONSTRUCTOR
//
// _args `client` and `data` are required_
//
//```
// var Account = importModule('coinbase').model.Account;
// var myAccount = new Account(client, {'id': 'A1234'});
//```
// _normally you will get account instances from `Account` methods on the `Client`
// but this constructor is useful if you already know the id of the account and
// wish to reduce calls to the remote API._
//
// - - -
class Account extends AccountBase {
  constructor(client, data) {
    if (!(this instanceof Account)) {
      return new Account(client, data);
    }
    super(client, data);
  }

  delete(callback) {
    const path = `accounts/${this.id}`;
    this.client._deleteHttp(path, callback);
  }

  setPrimary(callback) {
    const path = `accounts/${this.id}/primary`;
    this.client._postHttp(path, null, callback);
  }

  update(args, callback) {
    const self = this;
    const path = `accounts/${this.id}`;
    this.client._putHttp(path, args, function myPut(err, result) {
      if (err) {
        callback(err, null);
        return;
      }
      const account = new Account(self.client, result.data);
      callback(null, account);
    });
  }

  //```
  // args = {
  //   'id' : account_id
  // };
  getAddresses(args, callback) {
    const opts = {
      'colName'  : 'addresses',
      'ObjFunc'  : Address,
    };

    this._getAll(_.assign(args || {}, opts), callback)
  }

  getAddress(addressId, callback) {
    const opts = {
      'colName'  : 'addresses',
      'ObjFunc'  : Address,
      'id'       : addressId
    };
    this._getOne(opts, callback)
  }

  // ```
  // args = {
  //   'name': address label, (optional)
  //   'callback_url': callback_url (optional)
  // };
  // ```
  createAddress(args, callback) {
    const opts = {
      'colName'  : 'addresses',
      'ObjFunc'  : Address,
      'params'   : args
    };
    this._postOne(opts, callback)
  }

  getTransactions(args, callback) {

    const opts = {
      'colName'  : 'transactions',
      'ObjFunc'  : Transaction,
    };

    this._getAll(_.assign(args || {}, opts), callback)
  }

  getTransaction(transaction_id, callback) {

    const opts = {
      'colName' : 'transactions',
      'ObjFunc' : Transaction,
      'id'      : transaction_id
    };

    this._getOne(opts, callback);
  }

  //```
  // args = {
  //   'to'          : account_id,
  //   'amount'      : amount,
  //   'currency'    : currency,
  //   'description' : notes
  // };

  transferMoney(args, callback) {
    args.type = 'transfer';
    this._initTxn(args, callback);
  }

  //```
  // args = {
  //   'to'                 : bitcoin address or email,
  //   'amount'             : amount,
  //   'currency'           : currency,
  //   'description'        : notes,
  //   'skip_notifications' : don’t send notification emails,
  //   'fee'                : transaction fee,
  //   'idem'               : token to ensure idempotence
  // };
  sendMoney(args, callback, twoFactorAuth) {

    const tfa = twoFactorAuth ? {'CB-2FA-Token': twoFactorAuth} : null;
    args.type = 'send';

    this._initTxn(args, callback, tfa);
  }

  //```
  // args = {
  //   'to'          : account_id,
  //   'amount'      : amount,
  //   'currency'    : currency,
  //   'description' : notes
  // };
  requestMoney(args, callback) {
    args.type = 'request';
    this._initTxn(args, callback);
  }

  // Buys
  getBuys(args, callback) {

    const opts = {
      'colName'  : 'buys',
      'ObjFunc'  : Buy,
    };

    this._getAll(_.assign(args || {}, opts), callback)
  }

  getBuy(buy_id, callback) {

    const opts = {
      'colName'  : 'buys',
      'ObjFunc'  : Buy,
      'id'       : buy_id
    };

    this._getOne(opts, callback);
  }

  //```
  // args = {
  //   'amount'                  : amount,
  //   'total'                   : total,
  //   'currency'                : currency,
  //   'payment_method'          : payment_method_id,
  //   'agree_btc_amount_varies' : agree_btc_amount_varies,
  //   'commit'                  : commit,
  //   'quote'                   : quote
  // };
  buy(args, callback) {

    const opts = {
      'colName'  : 'buys',
      'ObjFunc'  : Buy,
      'params'   : args
    };

    this._postOne(opts, callback)
  }

  // Sells
  getSells(args, callback) {

    const opts = {
      'colName'  : 'sells',
      'ObjFunc'  : Sell,
    };

    this._getAll(_.assign(args || {}, opts), callback)
  }

  getSell(sell_id, callback) {

    const opts = {
      'colName'  : 'sells',
      'ObjFunc'  : Sell,
      'id'       : sell_id
    };

    this._getOne(opts, callback);
  }

  //```
  // args = {
  //   'amount'                  : amount,
  //   'total'                   : total,
  //   'currency'                : currency,
  //   'payment_method'          : payment_method_id,
  //   'agree_btc_amount_varies' : agree_btc_amount_varies,
  //   'commit'                  : commit,
  //   'quote'                   : quote
  // };
  sell(args, callback) {

    const opts = {
      'colName'  : 'sells',
      'ObjFunc'  : Sell,
      'params'   : args
    };

    this._postOne(opts, callback)
  }

  // Deposits
  getDeposits(args, callback) {

    const opts = {
      'colName'  : 'deposits',
      'ObjFunc'  : Deposit,
    };

    this._getAll(_.assign(args || {}, opts), callback)
  }

  getDeposit(deposit_id, callback) {

    const opts = {
      'colName'  : 'deposit',
      'ObjFunc'  : Deposit,
      'id'       : deposit_id
    };

    this._getOne(opts, callback);
  }

  //```
  // args = {
  //   'amount'                  : amount,
  //   'currency'                : currency,
  //   'payment_method'          : payment_method_id,
  //   'commit'                  : commit,
  // };
  deposit(args, callback) {

    const opts = {
      'colName'  : 'deposits',
      'ObjFunc'  : Deposit,
      'params'   : args
    };

    this._postOne(opts, callback)
  }

  // Withdrawals
  getWithdrawals(args, callback) {

    const opts = {
      'colName'  : 'withdrawals',
      'ObjFunc'  : Withdrawal,
    };

    this._getAll(_.assign(args || {}, opts), callback)
  }

  getWithdrawal(withdrawal_id, callback) {

    const opts = {
      'colName'  : 'withdrawals',
      'ObjFunc'  : Withdrawal,
      'id'       : withdrawal_id
    };

    this._getOne(opts, callback);
  }

  //```
  // args = {
  //   'amount'                  : amount,
  //   'currency'                : currency,
  //   'payment_method'          : payment_method_id,
  //   'commit'                  : commit,
  // };
  withdraw(args, callback) {

    const opts = {
      'colName'  : 'withdrawals',
      'ObjFunc'  : Withdrawal,
      'params'   : args
    };

    this._postOne(opts, callback)
  }
}

module.exports = Account;
