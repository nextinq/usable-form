import {
  getFieldInputName,
  getFieldParts,
  getFieldInputValue,
  setFieldInputValue,
  setupInput
} from '../field-utils';

describe('field-utils', () => {
  describe('getFieldParts', () => {
    it('should return one part for simple field', () => {
      expect(getFieldParts('firstName')).toEqual(['firstName']);
    });
    it('should return parts for nested field', () => {
      expect(getFieldParts('person.firstName')).toEqual([
        'person',
        'firstName'
      ]);
    });
  });

  describe('getFieldInputName', () => {
    it('should return fieldName part for simple field', () => {
      expect(getFieldInputName('firstName')).toEqual('firstName');
    });
    it('should return parts for nested field', () => {
      expect(getFieldInputName('person.firstName')).toEqual(
        'person__firstName'
      );
    });
  });

  describe('setupInput', () => {
    it('should return fieldName for simple field', () => {
      expect(setupInput('firstName')).toEqual({
        id: 'firstName',
        name: 'firstName'
      });
    });
    it('should return parts for nested field', () => {
      expect(setupInput('person.firstName')).toEqual({
        id: 'person__firstName',
        name: 'person__firstName'
      });
    });
  });

  describe('getFieldInputValue', () => {
    it('simpleField', () => {
      expect(getFieldInputValue('firstName', { firstName: 'Joe' })).toEqual(
        'Joe'
      );
    });

    it('existing nested field', () => {
      expect(
        getFieldInputValue('person.firstName', {
          person: {
            firstName: 'Joe'
          }
        })
      ).toEqual('Joe');
    });
    it('non existing nested field', () => {
      expect(
        getFieldInputValue('countries.us.code', {
          person: {
            firstName: 'Joe'
          }
        })
      ).toEqual(null);
    });
    it('non existing values', () => {
      expect(
        getFieldInputValue(null, {
          person: {
            firstName: 'Joe'
          }
        })
      ).toEqual(null);
    });
  });

  describe('setFieldInputValue', () => {
    it('simpleField', () => {
      expect(
        setFieldInputValue('firstName', 'Elvis', {
          firstName: 'Joe',
          lastName: 'Doe'
        })
      ).toEqual({ firstName: 'Elvis', lastName: 'Doe' });
    });
  });
});
