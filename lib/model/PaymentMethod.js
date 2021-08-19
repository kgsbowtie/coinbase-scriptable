"use strict";
var BaseModel = importModule('./BaseModel');

//##CONSTRUCTOR
//
// _args `client` and `data` are required_
//
//```
// var PaymentMethod = importModule('coinbase').model.PaymentMethod;
// var myMethod = new PaymentMethod(client, data);
//```
// _normally you will get users from `PaymentMethod` methods on the `Client`._
// - - -
function PaymentMethod(client, data) {
  if (!(this instanceof PaymentMethod)) {
    return new PaymentMethod(client, data);
  }
  BaseModel.call(this, client, data);
}

PaymentMethod.prototype = Object.create(BaseModel.prototype);

module.exports = PaymentMethod;

