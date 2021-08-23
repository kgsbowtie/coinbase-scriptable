const Transfer    = importModule('./Transfer');
const handleError = importModule('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Sell = importModule('coinbase').model.Sell;
// var mySell = new Sell(client, data, account);
//```
// - - -
class Sell extends Transfer {
  constructor(client, data, account) {
    if (!(this instanceof Sell)) {
      return new Sell(client, data, account);
    }
    super(client, data, account);
  }

  commit(callback) {

    const opts = {
      'colName' : 'sells',
      'ObjFunc' : Sell
    };

    this._commit(opts, callback);
  }
}

module.exports = Sell;
