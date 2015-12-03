'use strict';
let nodeValidator = require('validator');
let _ = require('lodash');
let moment = require('moment');

/**
 * Create a factory that returns validation functions conforming to the signature  (value) -> Boolean
 * @param fn
 * @param message
 * @returns {Function}
 */
function createValidationFn(fn, message) {
  return function () {
    return function (value) {
      return {
        success: fn(value),
        message: message
      };
    };
  };
}

/**
 * Checks if the input is a UUID (version 4)
 * @param message the error message to return
 * @returns {Function} a function that takes in a value and returns an object
 */
function isUUID(message) {

  message = message || 'Not a valid UUID(v4)';

  return function (value) {
    return {
      success: nodeValidator.isUUID(value, 4),
      message: message
    };
  };
}

/**
 * Checks if the input is not an empty string
 * @param message error message
 */
function isNotEmptyString(message) {
  message = message || 'Empty String';

  return function (value) {
    return {
      success: value !== '',
      message
    };
  };
}

/**
 * Returns a predicate that checks if the input adheres to the supplied date format (default ISO 8601)
 * @param format
 * @param message
 */
function isDate(format, message) {
  message = message || 'Not a valid date';

  format = format || moment.ISO_8601;

  return function (dateString) {
    let parsedDate = moment(dateString, format, true);
    return {
      success: parsedDate.isValid(),
      message: message
    };
  };
}

/**
 * Returns a predicate that checks if the input is strictly before given date
 * @param boundingDateString - date that bounds input
 * @param message
 * @returns {Function}
 */
function isDateBefore(boundingDateString, message) {
  message = message || `Date is not prior to ${boundingDateString}`;

  return function (dateString) {
    let date = moment(dateString);
    let boundingDate = moment(boundingDateString);

    return {
      success: date.isValid() && boundingDate.isValid() && date.isBefore(boundingDate),
      message: message
    };
  };
}

/**
 * Returns a predicate that checks if the input is strictly after given date
 * @param boundingDateString - date that bounds input
 * @param message
 * @returns {Function}
 */
function isDateAfter(boundingDateString, message) {
  message = message || `Date is not after ${boundingDateString}`;

  return function (dateString) {
    let date = moment(dateString);
    let boundingDate = moment(boundingDateString);
    return {
      success: date.isValid() && boundingDate.isValid() && date.isAfter(boundingDate),
      message: message
    };
  };
}

/**
 * Takes the negation of a predicate function
 * @param fn predicate function
 * @param message error message
 * @returns {Function} that takes a value and returns an Object{success: boolean, message: string}
 */
function not(fn, message) {
  message = message || 'Predicate did not match';
  return function (value) {
    return {
      success: !fn(value),
      message
    };
  };
}

function all(fn, message) {

  // TODO allow message to be formatted string
  message = message || 'Invalid item in collection';

  return function (collectionValue) {

    for (let key of Object.keys(collectionValue)) {
      let result = fn(collectionValue[key]);

      result = (typeof result === 'object') ? result : {
        success: result,
        message: message
      };

      if (!result.success) {
        return result;
      }
    }

    return {
      success: true,
      message: message
    };
  };
}

module.exports = {
  isUUID,
  isString: createValidationFn(_.isString, 'Not a valid string'),
  isNumber: createValidationFn(_.isNumber, 'Not a valid number'),
  isObject: createValidationFn(_.isObject, 'Not a valid object'),
  isURL: createValidationFn(nodeValidator.isURL, 'Not a valid URL'),
  isDate,
  isDateBefore,
  isDateAfter,
  isNotEmptyString,
  not,
  all
};
