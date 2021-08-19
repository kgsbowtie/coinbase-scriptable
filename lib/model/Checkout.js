"use strict";
var BaseModel   = importModule('./BaseModel'),
    Order       = importModule('./Order'),
    handleError = importModule('../errorHandler').handleError,
    _           = Object // importModule('lodash');

// ##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Checkout = importModule('coinbase').model.Checkout;
// var myCheckout = new Checkout(client, data);
//```
function Checkout(client, data) {
  if (!(this instanceof Checkout)) {
    return new Checkout(client, data);
  }
  BaseModel.call(this, client, data);
}

Checkout.prototype = Object.create(BaseModel.prototype);

Checkout.prototype.getOrders = function(args, callback) {

  var opts = {
    'colName'  : 'checkouts/' + this.id + '/orders',
    'ObjFunc'  : Order
  };

  this.client._getAllHttp(_.assign(args || {}, opts), callback)
};

Checkout.prototype.createOrder = function(callback) {

  var opts = {
    'colName'  : 'checkouts/' + this.id + '/orders',
    'ObjFunc' : Order,
  };

  this.client._postOneHttp(opts, callback);
};

module.exports = Checkout;

