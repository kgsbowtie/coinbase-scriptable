const BaseModel   = importModule('./BaseModel');

//##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Notification = importModule('coinbase').model.Notification;
// var myNotification = new Notification(client, data);
//```
// - - -

class Notification extends BaseModel {
  constructor(client, data) {
    if (!(this instanceof Notification)) {
      return new Notification(client, data);
    }
    super(client, data);
  }
}

module.exports = Notification;
