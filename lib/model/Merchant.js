"use strict";
var BaseModel = importModule('./BaseModel');

//##CONSTRUCTOR
//
// _args `client` and `data` are required_
//
//```
// var Merchant = importModule('coinbase').model.Merchant;
// var myMethod = new Merchant(client, data);
//```
// _normally you will get users from `Merchant` methods on the `Client`._
// - - -
function Merchant(client, data) {
  if (!(this instanceof Merchant)) {
    return new Merchant(client, data);
  }
  BaseModel.call(this, client, data);
}

Merchant.prototype = Object.create(BaseModel.prototype);

module.exports = Merchant;

