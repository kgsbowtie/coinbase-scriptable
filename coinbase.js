var Account       = importModule('./lib/model/Account.js'),
    Address       = importModule('./lib/model/Address.js'),
    Buy           = importModule('./lib/model/Buy.js'),
    Checkout      = importModule('./lib/model/Checkout.js'),
    Client        = importModule('./lib/Client.js'),
    Deposit       = importModule('./lib/model/Deposit.js'),
    Merchant      = importModule('./lib/model/Merchant.js'),
    Notification  = importModule('./lib/model/Notification.js'),
    Order         = importModule('./lib/model/Order.js'),
    PaymentMethod = importModule('./lib/model/PaymentMethod.js'),
    Sell          = importModule('./lib/model/Sell.js'),
    Transaction   = importModule('./lib/model/Transaction.js'),
    User          = importModule('./lib/model/User.js'),
    Withdrawal    = importModule('./lib/model/Withdrawal.js');

var model = {
  'Account'       : Account,
  'Address'       : Address,
  'Buy'           : Buy,
  'Checkout'      : Checkout,
  'Deposit'       : Deposit,
  'Merchant'      : Merchant,
  'Notification'  : Notification,
  'Order'         : Order,
  'PaymentMethod' : PaymentMethod,
  'Sell'          : Sell,
  'Transaction'   : Transaction,
  'User'          : User,
  'Withdrawal'    : Withdrawal
};

module.exports = {
  'Client' : Client,
  'model'  : model
};

