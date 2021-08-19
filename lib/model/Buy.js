"use strict";
var Transfer    = importModule('./Transfer'),
    handleError = importModule('../errorHandler').handleError;

//##CONSTRUCTOR
//
// _args `client`, `data`, and `account` required_
//
//```
// var Buy = importModule('coinbase').model.Buy;
// var myBuy = new Buy(client, data, account);
//```
// - - -
function Buy(client, data, account) {
  if (!(this instanceof Buy)) {
    return new Buy(client, data, account);
  }
  Transfer.call(this, client, data, account);
}

Buy.prototype = Object.create(Transfer.prototype);

Buy.prototype.commit = function(callback) {

  var opts = {
    'colName' : 'buys',
    'ObjFunc' : Buy
  };

  this._commit(opts, callback);
};

module.exports = Buy;
