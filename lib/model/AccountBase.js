//
// The AccountBase object has helper methods for the Account API
//
const BaseModel   = importModule('./BaseModel');
//_           = importModule('lodash');

const handleError = importModule('../errorHandler').handleError;
const Transaction = importModule('./Transaction');

// Constructor
//
// You must instantiate an 'Account' with the 'new' operator.
// ```
// new Acccount(c,d)
// ```
// 'client' and 'data' arguments are requried.
//
class AccountBase extends BaseModel {
  constructor(client, data) {
    if (!(this instanceof AccountBase)) {
      return new AccountBase(client, data);
    }
    super(client, data);
  }

  // INTERNAL API
  //
  // ```
  // opts = {
  //   'colName'  : colName,
  // };
  // ```
  //
  _getAll(opts, callback, headers) {
    const self = this;
    let args = {};
    let path;
    if (this.hasField(opts, 'next_uri')) {
      path = opts.next_uri.replace('/v2/', '');
      args = null;
    } else {
      path = `accounts/${this.id}/${opts.colName}`;
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

    this.client._getHttp(path, args, function onGet(err, result) {
      if (!handleError(err, result, callback)) {
        if (result.data.length > 0) {
          var ObjFunc = self.client._stringToClass(result.data[0].resource);
        }
        const objs = result.data.map(function onMap(obj) {
          return new ObjFunc(self.client, obj, self);
        });
        callback(null, objs, result.pagination);
      }
    }, headers);
  }

  // INTERNAL API
  //
  // ```
  // opts = {
  //   'colName': colName,
  //   'id': id
  // };
  // ```
  //
  _getOne({colName, id}, callback, headers) {
    const self = this;
    const path = `accounts/${this.id}/${colName}/${id}`;
    this.client._getHttp(path, null, function onGet(err, obj) {
      if (!handleError(err, obj, callback)) {
        const ObjFunc = self.client._stringToClass(obj.data.resource);
        callback(null, new ObjFunc(self.client, obj.data, self));
      }
    }, headers);
  }

  // ```
  // opts = {
  //   'colName': colName,
  //   'params' : params
  // };
  // ```
  _postOne({colName, params}, callback, headers) {
    const self = this;
    const path = `accounts/${this.id}/${colName}`;
    this.client._postHttp(path, params, function onPost(err, obj) {
      if (!handleError(err, obj, callback)) {
        const ObjFunc = self.client._stringToClass(obj.data.resource);
        callback(null, new ObjFunc(self.client, obj.data, self));
      }
    }, headers);
  }

  // INTERNAL API
  _initTxn(args, callback, headers) {
    const self = this;
    const path = `accounts/${this.id}/transactions`;

    this.client._postHttp(path, args, function onPost(err, obj) {
        if (!handleError(err, obj, callback)) {
          const txn = new Transaction(self.client, obj.data, self);
          callback(null, txn);
        }
      }, headers);
  }
}

module.exports = AccountBase;
