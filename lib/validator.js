'use strict';

/**
 * This is a validation computation builder that is primarily used by Models.
 */
class Validator {
  constructor (options) {
    this.options = options;
    this.validators = {};
  }

  /**
   * Adds validator function(s) to the validation computation builder.
   * @param propertyName The property that will be validated by the validation functions
   * @param required The property is either required (true) or optional (false)
   * @param validationFns The functions that will validate the property.
   *        The function signature can be described as
   *        (propertyData) -> Object(success: boolean, message: string (error message))
   */
  add (propertyName, required, ...validationFns) {
    this.validators[propertyName] = {required, validationFns};
  }

  /**
   * Validates the data using the built-up validation functions (using add)
   * @param data the data to be validated by the validation functions
   * @returns Object {success: boolean, message: string (Optional), failedProperty: string (Optional)}
   *          The object tells you whether the data was validated successfully and returns you
   *          a useful message and a property that caused the failure if something went wrong
   */
  validate (data) {
    // Iterate over the list of validators (the keys since its a map)
    for (let key of Object.keys(this.validators)) {
      let value = data[key];
      let validator = this.validators[key];

      // Ensure the property is required
      if (value === undefined && validator.required) {
        return {success: false, failedProperty: key, message: `${key} is not present`};
      }

      // If the property is optional and not present, then ignore it
      else if (value === undefined && validator.required === false) {
        continue;
      }

      // Each validator is an object consisting of validation functions that we apply on the property-data
      // Iterate over each function and apply it on the data to get boolean results which will be transformed
      for (let validatorFn of validator.validationFns) {

        let result = validatorFn(value);
        if (!result.success) {
          result.failedProperty = key;
          return result;
        }
      }
    }
    return {success: true};
  }
}

module.exports = Validator;
