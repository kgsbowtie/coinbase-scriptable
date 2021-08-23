const BaseModel = importModule('./BaseModel');

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
class PaymentMethod extends BaseModel {
  constructor(client, data) {
    if (!(this instanceof PaymentMethod)) {
      return new PaymentMethod(client, data);
    }
    super(client, data);
  }
}

module.exports = PaymentMethod;

