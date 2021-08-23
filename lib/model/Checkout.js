const BaseModel   = importModule('./BaseModel'); // importModule('lodash');
const Order       = importModule('./Order');
const handleError = importModule('../errorHandler').handleError;
const _           = Object;

// ##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Checkout = importModule('coinbase').model.Checkout;
// var myCheckout = new Checkout(client, data);
//```
class Checkout extends BaseModel {
  constructor(client, data) {
    if (!(this instanceof Checkout)) {
      return new Checkout(client, data);
    }
    super(client, data);
  }

  getOrders(args, callback) {

    const opts = {
      'colName'  : `checkouts/${this.id}/orders`,
      'ObjFunc'  : Order
    };

    this.client._getAllHttp(_.assign(args || {}, opts), callback)
  }

  createOrder(callback) {

    const opts = {
      'colName'  : `checkouts/${this.id}/orders`,
      'ObjFunc' : Order,
    };

    this.client._postOneHttp(opts, callback);
  }
}

module.exports = Checkout;

