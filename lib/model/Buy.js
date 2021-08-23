const Transfer    = importModule('./Transfer');
const handleError = importModule('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Buy = importModule('coinbase').model.Buy;
// var myBuy = new Buy(client, data, account);
//```
// - - -
class Buy extends Transfer {
  constructor(client, data, account) {
    if (!(this instanceof Buy)) {
      return new Buy(client, data, account);
    }
    super(client, data, account);
  }

  commit(callback) {

    const opts = {
      'colName' : 'buys',
      'ObjFunc' : Buy
    };

    this._commit(opts, callback);
  }
}

module.exports = Buy;
