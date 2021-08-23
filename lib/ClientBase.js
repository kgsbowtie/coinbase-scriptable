//request       = importModule('request'),
const handleError   = importModule('./errorHandler').handleError;

const handleHttpError   = importModule('./errorHandler').handleHttpError;
const Base          = importModule('./Base');
const Account       = importModule('./model/Account');
const Address       = importModule('./model/Address');
const Buy           = importModule('./model/Buy');
const Checkout      = importModule('./model/Checkout');
const Deposit       = importModule('./model/Deposit');
const Merchant      = importModule('./model/Merchant');
const Notification  = importModule('./model/Notification');
const Order         = importModule('./model/Order');
const PaymentMethod = importModule('./model/PaymentMethod');
const Sell          = importModule('./model/Sell');
const Transaction   = importModule('./model/Transaction');
const User          = importModule('./model/User');
const Withdrawal    = importModule('./model/Withdrawal');

const crypto        = importModule('/lib/hmac');

const _             = importModule('/lib/lodash');
const qs            = importModule('/lib/querystring');

const assign        = Object.assign;

const CERT_STORE    = importModule('./CoinbaseCertStore');

const BASE_URI           = 'https://api.coinbase.com/v2/';
const TOKEN_ENDPOINT_URI = 'https://api.coinbase.com/oauth/token';

const MODELS = {
  'account'        : Account,
  'address'        : Address,
  'buy'            : Buy,
  'checkout'       : Checkout,
  'deposit'        : Deposit,
  'merchant'       : Merchant,
  'notification'   : Notification,
  'order'          : Order,
  'payment_method' : PaymentMethod,
  'sell'           : Sell,
  'transaction'    : Transaction,
  'user'           : User,
  'withdrawal'     : Withdrawal
};

//
// constructor
//
// opts = {
//   'apiKey'       : apyKey,
//   'apiSecret'    : apySecret,
//   'baseApiUri'   : baseApiUri,
//   'tokenUri'     : tokenUri,
//   'caFile'       : caFile,
//   'strictSSL'    : strictSSL,
//   'accessToken'  : accessToken,
//   'refreshToken' : refreshToken,
//   'version'      : version
// };
class ClientBase extends Base {
  constructor(opts) {
    super(opts);
    if (!(this instanceof ClientBase)) {
      return new ClientBase(opts);
    }

    // assign defaults and options to the context
    assign(this, {
      baseApiUri: BASE_URI,
      tokenUri: TOKEN_ENDPOINT_URI,
      caFile: CERT_STORE,
      strictSSL: true,
      timeout: 5000,
    }, opts);

    // check for the different auth strategies
    const api = !!(this.apiKey && this.apiSecret);
    const oauth = !!this.accessToken;

    // XOR
    if (!(api ^ oauth)) {
      throw new Error('you must either provide an "accessToken" or the "apiKey" & "apiSecret" parameters');
    }
  }

  //
  // private methods
  //

  _setAccessToken(path) {

    // OAuth access token
    if (this.accessToken) {
      if (path.includes('?')) {
        return `${path}&access_token=${this.accessToken}`;
      }
      return `${path}?access_token=${this.accessToken}`;
    }
    return path
  }

  _generateSignature(path, method, bodyStr) {
    const timestamp = Math.floor(Date.now() / 1000);
    const message = `${timestamp + method}/v2/${path}${bodyStr}`;
    const signature = crypto.createHmac('sha256', this.apiSecret).update(message).digest('hex');

    return {
      'digest': signature,
      'timestamp': timestamp
    };
  }

  _generateReqOptions(url, path, body, method, headers) {

    const bodyStr = body ? JSON.stringify(body) : '';

    // specify the options
    let options = {
      'url': url,
      'ca': this.caFile,
      'strictSSL': this.strictSSL,
      'body': bodyStr,
      'method': method,
      'timeout': this.timeout,
      'headers' : {
        'Content-Type'     : 'application/json',
        'Accept'           : 'application/json',
        'User-Agent'       : 'coinbase/node/1.0.4'
      }
    };

    options.headers = assign(options.headers, headers);


    // add additional headers when we're using the "api key" and "api secret"
    if (this.apiSecret && this.apiKey) {
      const sig = this._generateSignature(path, method, bodyStr);

      // add signature and nonce to the header
      options.headers = assign(options.headers, {
        'CB-ACCESS-SIGN': sig.digest,
        'CB-ACCESS-TIMESTAMP': sig.timestamp,
        'CB-ACCESS-KEY': this.apiKey,
        'CB-VERSION': this.version || '2021-05-27'
      })
    }

    return options;
  }

  async _getHttp(path, args, headers) {
    let params = '';
    if (args && !_.isEmpty(args)) {
      params = `?${qs.stringify(args)}`;
    }
    const url = this.baseApiUri + this._setAccessToken(path + params);
    const opts = this._generateReqOptions(url, path + params, null, 'GET', headers);
    console.log(url)
    let request = new Request(opts.url);
    request.body = opts.body
    request.headers = opts.headers
    request.method = opts.method
    request.timeoutInterval = opts.timeout ?? 60 // default 60 seconds for timeout
    let returnVal;
    returnVal = await request.loadJSON().then(
      success => {
        return {
          'err': null,
          'obj': success
        }
      },
      error => {
        return {
            'err': error,
            'obj': null
          }
        }
    )
    return returnVal

    // request.get(opts, function onGet(err, response, body) {
    //   if (!handleHttpError(err, response, callback)) {
    //     if (!body) {
    //       callback(new Error("empty response"), null);
    //     } else {
    //       const obj = JSON.parse(body);
    //       callback(null, obj);
    //     }
    //   }
    // });
    // function onGet(err, obj) {
    //   if (!handleError(err, obj, callback)) {
    //     if (obj.data.resource) {
    //       const ObjFunc = self._stringToClass(obj.data.resource);
    //       callback(null, new ObjFunc(self, obj.data));
    //     } else {
    //       callback(null, obj);
    //     }
    //   }
    // }
  }

  _postHttp(path, body, callback, headers) {

    const url = this.baseApiUri + this._setAccessToken(path);
    body = body || {}

    const options = this._generateReqOptions(url, path, body, 'POST', headers);

    request.post(options, function onPost(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        if (body) {
          const obj = JSON.parse(body);
          callback(null, obj);
        } else {
          callback(null, body);
        }
      }
    });
  }

  _putHttp(path, body, callback, headers) {

    const url = this.baseApiUri + this._setAccessToken(path);

    const options = this._generateReqOptions(url, path, body, 'PUT', headers);

    request.put(options, function onPut(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        if (body) {
          const obj = JSON.parse(body);
          callback(null, obj);
        } else {
          callback(null, body);
        }
      }
    });
  }

  _deleteHttp(path, callback, headers) {
    const url = this.baseApiUri + this._setAccessToken(path);
    request.del(url, this._generateReqOptions(url, path, null, 'DELETE', headers),
    function onDel(err, response, body) {
      if (!handleHttpError(err, response, callback)) {
        callback(null, body);
      }
    });
  }

  //
  // opts = {
  //   'colName'        : colName,
  //   'next_uri'       : next_uri,
  //   'starting_after' : starting_after,
  //   'ending_before'  : ending_before,
  //   'limit'          : limit,
  //   'order'          : order
  // };
  // ```
  //
  _getAllHttp(opts, callback, headers) {
    const self = this;
    let args = {};
    let path;
    if (this.hasField(opts, 'next_uri')) {
      path = opts.next_uri.replace('/v2/', '');
      args = null;
    } else {
      path = opts.colName;
      if (this.hasField(opts, 'starting_after')) {
        args.starting_after = opts.starting_after;
      }
      if (this.hasField(opts, 'ending_before')) {
        args.ending_before = opts.ending_before;
      }
      if (this.hasField(opts, 'limit')) {
        args.limit = opts.limit;
      }
      if (this.hasField(opts, 'order')) {
        args.order = opts.order;
      }
    }

    this._getHttp(path, args, function onGet(err, result) {
      if (!handleError(err, result, callback)) {
        let objs = [];
        if (result.data.length !== 0) {
          const ObjFunc = self._stringToClass(result.data[0].resource);
          objs = _.map(result.data, function onMap(obj) {
            return new ObjFunc(self, obj);
          });
        }
        callback(null, objs, result.pagination);
      }
    }, headers);
  }

  //
  // args = {
  // 'path'     : path,
  // 'params'   : params,
  // }
  //
  async _getOneHttp({path, params}, headers) {
    const self = this;
    let results = await this._getHttp(path, params, headers);
    let {err,obj} = results;
    console.log(results)
    if (!handleError(err, obj)) {
      if (obj?.data?.resource) {
        const ObjFunc = self._stringToClass(obj.data.resource);
        return new ObjFunc(self, obj.data);
      } else {
        return obj
      }
    }
  }

  //
  // opts = {
  // 'colName'  : colName,
  // 'params'   : args
  // }
  //
  _postOneHttp({params, colName}, callback, headers) {
     const self = this;
     const body = params;
     this._postHttp(colName, body, function onPost(err, obj) {
      if (!handleError(err, obj, callback)) {
        if (obj.data.resource) {
          const ObjFunc = self._stringToClass(obj.data.resource);
          callback(null, new ObjFunc(self, obj.data));
        } else {
          callback(null, obj);
        }
      }
    }, headers);
  }

  _stringToClass(name) {
    return MODELS[name];
  }
}

module.exports = ClientBase;
