const ClientBase    = importModule('./ClientBase');

//request       = importModule("request"),
const handleError   = importModule('./errorHandler').handleError;

const Account       = importModule("./model/Account");
const Checkout      = importModule("./model/Checkout");
const Notification  = importModule("./model/Notification");
const Order         = importModule("./model/Order");
const PaymentMethod = importModule("./model/PaymentMethod");
const User          = importModule("./model/User");
const Merchant      = importModule("./model/Merchant");
const crypto        = importModule("/lib/hmac");
const _             = importModule("/lib/lodash");
const qs            = importModule("/lib/querystring");
const assign        = Object.assign;

const callback_key  = importModule('./CallbackKey.js');

class Client extends ClientBase {
  constructor(opts) {
    super(opts);
    if (!(this instanceof Client)) {
      return new Client(opts);
    }
    
  }

  refresh(callback) {
    const self = this;
    const params = {
                   'grant_type'    : 'refresh_token',
                   'refresh_token' : this.refreshToken
                 };
    const path = this.tokenUri;
    this._postHttp(path, params, function myPost(err, result) {

      if (err) {
        err.type = etypes.TokenRefreshError;
        callback(err, result);
        return;
      }
      self.accessToken = result.access_token;
      self.refreshToken = result.refresh_token;
      callback(null, result);
    });
  }

  getAccounts(args, callback) {

    const opts = {
      'colName'  : 'accounts',
      'ObjFunc'  : Account
    };

    this._getAllHttp(_.assign(args || {}, opts), callback)
  }

  getAccount(account_id, callback) {

    const opts = {
      'path'     : `accounts/${account_id}`,
      'ObjFunc'  : Account
    };
    this._getOneHttp(opts, callback);
  }

  createAccount(args, callback) {

    const opts = {
      'colName'  : 'accounts',
      'ObjFunc'  : Account,
      'params'   : args
    };

    this._postOneHttp(opts, callback);
  }

  async getCurrentUser() {
    const opts = {
      'path'     : 'user',
      'ObjFunc'  : User
    };

    return this._getOneHttp(opts);
  }

  getUser(userId, callback) {

    const opts = {
      'path'     : `users/${userId}`,
      'ObjFunc'  : User
    };

    this._getOneHttp(opts, callback);
  }

  getNotifications(args, callback) {

    const opts = {
      'colName'  : 'notifications',
      'ObjFunc'  : Notification
    };

    this._getAllHttp(_.assign(args || {}, opts), callback)
  }

  getNotification(notificationId, callback) {

    const opts = {
      'path'     : `notifications/${notificationId}`,
      'ObjFunc'  : Notification
    };
    this._getOneHttp(opts, callback);
  }

  async getBuyPrice(params, callback) {

    let currencyPair;
    if (params.currencyPair) {
      currencyPair = params.currencyPair;
    } else if (params.currency) {
      currencyPair = `BTC-${params.currency}`;
    } else {
      currencyPair = 'BTC-USD';
    }
    return this._getOneHttp({'path': `prices/${currencyPair}/buy`});
  }

  getSellPrice(params, callback) {

    let currencyPair;
    if (params.currencyPair) {
      currencyPair = params.currencyPair;
    } else if (params.currency) {
      currencyPair = `BTC-${params.currency}`;
    } else {
      currencyPair = 'BTC-USD';
    }
    this._getOneHttp({'path': `prices/${currencyPair}/sell`}, callback);
  }

  getSpotPrice(params, callback) {
    let opts;
    let currencyPair;
    if (params.currencyPair) {
      currencyPair = params.currencyPair;
      delete params.currencyPair;
    } else if (params.currency) {
      currencyPair = `BTC-${params.currency}`;
      delete params.currency;
    } else {
      currencyPair = 'BTC-USD';
    }
    opts = {'path': `prices/${currencyPair}/spot`, 'params': params};

    this._getOneHttp(opts, callback);
  }

  // deprecated. use getSpotPrice with ?date=YYYY-MM-DD
  getHistoricPrices(params, callback) {

    this._getOneHttp({'path': 'prices/historic', 'params': params} , callback);
  }

  async getCurrencies(callback) {

    return this._getOneHttp({'path': 'currencies'});
  }

  getExchangeRates(params, callback) {

    this._getOneHttp({'path': 'exchange-rates', 'params': params}, callback);
  }

  async getTime() {

    return this._getOneHttp({'path': 'time'});
  }

  getPaymentMethods(args, callback) {

    const opts = {
      'colName'  : 'payment-methods',
      'ObjFunc'  : PaymentMethod
    };

    this._getAllHttp(_.assign(args || {}, opts), callback)
  }

  getPaymentMethod(methodId, callback) {

    const opts = {
      'path'     : `payment-methods/${methodId}`,
      'ObjFunc'  : PaymentMethod
    };

    this._getOneHttp(opts, callback);
  }

  // Merchant Endpoints
  getOrders(args, callback) {

    const opts = {
      'colName'  : 'orders',
      'ObjFunc'  : Order
    };

    this._getAllHttp(_.assign(args || {}, opts), callback)
  }

  getOrder(orderId, callback) {

    const opts = {
      'path'     : `orders/${orderId}`,
      'ObjFunc'  : Order
    };

    this._getOneHttp(opts, callback);
  }

  createOrder(args, callback) {

    const opts = {
      'colName'  : 'orders',
      'ObjFunc' : Order,
      'params' : args
    };

    this._postOneHttp(opts, callback);
  }

  getCheckouts(args, callback) {

    const opts = {
      'colName'  : 'checkouts',
      'ObjFunc'  : Checkout
    };

    this._getAllHttp(_.assign(args || {}, opts), callback)

  }

  getCheckout(checkoutId, callback) {

    const opts = {
      'path'     : `checkouts/${checkoutId}`,
      'ObjFunc'  : Checkout
    };

    this._getOneHttp(opts, callback);
  }

  createCheckout(args, callback) {

    const opts = {
      'colName'  : 'checkouts',
      'ObjFunc' : Checkout,
      'params' : args
    };

    this._postOneHttp(opts, callback);
  }

  getMerchant(merchantId, callback) {

    const opts = {
      'path'    : `merchants/${merchantId}`,
      'ObjFunc' : Merchant
    };

    this._getOneHttp(opts, callback);
  }

  verifyCallback(body, signature) {
    var verifier = crypto.createVerify('RSA-SHA256');
    verifier.update(body);
    return verifier.verify(callback_key, signature, 'base64');
  };

  toString() {
    return `Coinbase API Client for ${this.baseApiUri}`;
  }
}

module.exports = Client;

