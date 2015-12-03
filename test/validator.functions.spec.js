'use strict';
let expect = require('chai').expect;
let Validator = require('../lib/validator');
let validationHelper = require('../lib/validator.functions');
let uuid = require('node-uuid');

describe('validator helpers', function () {

  it('.validate is not successful for invalid UUID', function () {
    let validator = new Validator();
    validator.add('id', true, validationHelper.isUUID());

    expect(validator.validate({id: 'Not A Valid UUID'}).success).to.be.false;
  });

  it('.validate is successful for a valid UUID', function () {
    let validator = new Validator();
    validator.add('id', true, validationHelper.isUUID());
    expect(validator.validate({id: uuid.v4()}).success).to.be.true;
  });

  it('.validate is successful not a valid string', function () {
    let validator = new Validator();
    validator.add('id', true, validationHelper.isString());
    expect(validator.validate({id: 123}).success).to.be.false;
  });

  it('.validate is not successful for invalid date', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDate());
    expect(validator.validate({date: '2015-10T14:59:35.546Z'}).success).to.be.false;
  });

  it('.validate is successful for a valid date', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDate());
    expect(validator.validate({date: '2015-10-26T14:59:35.546Z'}).success).to.be.true;
  });

  it('.validate is successful for DateA is before DateB', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDateBefore('2015-10-25T14:59:35.546Z'));
    expect(validator.validate({date: '2015-10-24T14:59:35.546Z'}).success).to.be.true;
  });

  it('.validate is not successful for DateB is before DateA', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDateBefore('2015-10-26T14:59:35.546Z'));
    expect(validator.validate({date: '2015-10-26T14:59:36.546Z'}).success).to.be.false;
  });

  it('.validate is not successful for DateA is before DateA', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDateBefore('2015-10-25T14:59:35.546Z'));
    expect(validator.validate({date: '2015-10-25T14:59:35.546Z'}).success).to.be.false;
  });

  it('.validate is not successful for DateA is after DateB', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDateAfter('2015-10-25T14:59:35.546Z'));
    expect(validator.validate({date: '2015-10-24T14:59:35.546Z'}).success).to.be.false;
  });

  it('.validate is successful for DateB is after DateA', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDateAfter('2015-10-25T14:59:35.546Z'));
    expect(validator.validate({date: '2015-10-26T14:59:35.546Z'}).success).to.be.true;
  });

  it('.validate is successful for DateA is before DateB for different time zones', function () {
    let validator = new Validator();
    validator.add('date', true, validationHelper.isDateBefore('2015-10-25T14:59:35.546Z'));
    expect(validator.validate({date: '2015-10-25T13:59:35.546+01:00'}).success).to.be.true;
  });
});
