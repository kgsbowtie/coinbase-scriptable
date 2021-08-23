const BaseModel   = importModule('./BaseModel');
const handleError = importModule('../errorHandler').handleError;

// ##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Order = importModule('coinbase').model.Order;
// var button = new Order(client, data);
//```
class Order extends BaseModel {
  constructor(client, data) {
    if (!(this instanceof Order)) {
      return new Order(client, data);
    }
    super(client, data);
  }

  //```
  // args = {
  //   'currency'        : currency,
  //   'mispayment'      : mispayment,
  //   'refund_address'  : refund_address,
  // };
  refund(args, callback) {
    const self = this;
    if (!self.client) {throw "no client";}
    if (!self.id) {
      callback(new Error("no order id"), null);
      return;
    }

    const path = `orders/${self.id}/refund`;

    self.client._postHttp(path, args, function onPost(err, result) {
      if (!handleError(err, result, callback)) {
        const order = new Order(self.client, result.data);
        callback(null, order);
      }
    });
  }
}

module.exports = Order;

