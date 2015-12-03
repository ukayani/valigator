'use strict';
let expect = require('chai').expect;
let Validator = require('../lib/validator');

describe('validator', function () {

  it('.validate', function () {
    let validator = new Validator();
    validator.add('name', true,
      function (val) {
        return {success: val.length > 5, message: 'length less than 5'};
      },
      function (val) {
        return {success: val.length < 10, message: 'length greater than 10'};
      }
    );

    expect(validator.validate({name: 'Dexter'}).success).to.be.true;
  });

  it('.validate required property with no validators with valid data', function () {
    let validator = new Validator();
    validator.add('name', true);
    let result = validator.validate({name: 'Dexter'});
    expect(result.success).to.be.true;
  });

  it('.validate required property with no validators with no supplied value', function () {
    let validator = new Validator();
    validator.add('name', true);
    let result = validator.validate({});
    expect(result.success).to.be.false;
    expect(result.failedProperty).to.be.equal('name');
  });

  it('.validate optional property with validators with no supplied value', function () {
    let validator = new Validator();
    validator.add('name', false,
      function (val) {
        return {success: val.length > 5, message: 'length less than 5'};
      }
    );

    expect(validator.validate({}).success).to.be.true;
  });
});
