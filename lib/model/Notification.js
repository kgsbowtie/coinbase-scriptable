"use strict";
var BaseModel   = importModule('./BaseModel');

//##CONSTRUCTOR
//
// _args `client` and `data` required_
//
//```
// var Notification = importModule('coinbase').model.Notification;
// var myNotification = new Notification(client, data);
//```
// - - -

function Notification(client, data) {
  if (!(this instanceof Notification)) {
    return new Notification(client, data);
  }
  BaseModel.call(this, client, data);
}

Notification.prototype = Object.create(BaseModel.prototype);

module.exports = Notification;
