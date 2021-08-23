"use strict";
var createError = importModule('/lib/http-errors');

function _convertErrorName(errorId) {

  errorId = errorId.charAt(0).toUpperCase() + errorId.slice(1);
  return errorId.replace(/(\_\w)/g, function(m) {
    return m[1].toUpperCase();
  });
};

function _parseError(error) {

  if (error.errors) {
    return error.errors[0];
  }

  if (error.error) {
    return {
      id: error.error,
      message: error.error_description
    };
  }
};

function handleHttpError(err, response) {

  if (!!err) {
    return true;
  }
  if (!response) {
    createError('no response')
    return true;
  }
  if (response.statusCode !== 200 &&
      response.statusCode !== 201 &&
      response.statusCode !== 204) {
    var error;
    try {
      var errorBody = _parseError(JSON.parse(response.body));
      error = createError(response.statusCode,
                          errorBody.message,
                          {name: _convertErrorName(errorBody.id)});
    } catch (ex) {
      error = createError(response.statusCode, response.body);
    }
    return true;
  }
  return false;
}

function handleError(err, obj) {

  if (!!err) {
    return true;
  }
  if (obj?.error) {
    createError(obj.error, {name: 'APIError'})
    return true;
  }
  if (obj?.errors) {
    createError(obj, {name: 'APIError'})
    return true;
  }
  if (obj?.success !== undefined && obj.success !== true) {
    createError(obj, {name: 'APIError'})
    return true;
  }
  return false;
}

module.exports.handleError     = handleError;
module.exports.handleHttpError = handleHttpError;

