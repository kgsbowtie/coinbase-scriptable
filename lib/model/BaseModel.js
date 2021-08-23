const Base = importModule('../Base');
const assign = Object.assign;

//
// model super class that merges model data with object
//

class BaseModel extends Base {
  constructor(client, data) {
    if (!(this instanceof BaseModel)) {
      return new BaseModel(client, data);
    }
    if (!client) { throw new Error("client is null"); }
    this.client = client;
    if (!data) { throw new Error("data is null"); }
    if (!data.hasOwnProperty('id') && 
        !data.hasOwnProperty('code') && 
        !data.hasOwnProperty('email')) 
      { throw new Error(`data has no id, code, or email: ${JSON.stringify(data)}`);}

    assign(this, data);
  }
}

module.exports = BaseModel;

