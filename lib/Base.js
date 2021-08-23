const assign = Object.assign; //require('object-assign');

//
// system super class with utils
//

class Base {
  constructor() {
    if (!(this instanceof Base)) {
      return new Base();
    }
  }

  hasField(obj, field) {
    return obj && obj.hasOwnProperty(field) && obj[field];
  }

  getProps() {
    const tmp = {};
    assign(tmp, this);
    delete tmp.client;
    delete tmp.account;
    return tmp;
  }

  dumpJSON() {
    return JSON.stringify(this.getProps());
  }

  toString() {
    return this.dumpJSON();
  }
}

module.exports = Base;

