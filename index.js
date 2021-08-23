const Account       = importModule('./lib/model/Account.js');
const Address       = importModule('./lib/model/Address.js');
const Buy           = importModule('./lib/model/Buy.js');
const Checkout      = importModule('./lib/model/Checkout.js');
const Client        = importModule('./lib/Client.js');
const Deposit       = importModule('./lib/model/Deposit.js');
const Merchant      = importModule('./lib/model/Merchant.js');
const Notification  = importModule('./lib/model/Notification.js');
const Order         = importModule('./lib/model/Order.js');
const PaymentMethod = importModule('./lib/model/PaymentMethod.js');
const Sell          = importModule('./lib/model/Sell.js');
const Transaction   = importModule('./lib/model/Transaction.js');
const User          = importModule('./lib/model/User.js');
const Withdrawal    = importModule('./lib/model/Withdrawal.js');

const model = {
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

