// @ts-nocheck
import * as React from 'react';
import { mount } from 'enzyme';
import { useForm, initUseForm } from '../index';

const errors = {
  firstNameRequired: {
    source: 'firstName',
    code: 'required',
    message: 'First name is required',
    severity: 'error'
  }
};

function Form(props) {
  const { initialValues, onSubmit, validationSchema, validateForm } = props;
  const { setupField, formValues, formState } = useForm({
    initialValues,
    validationSchema,
    validateForm
  });
  return (
    <form>
      <input {...setupField('firstName')} />
      <button id="submit" type="submit" onSubmit={() => onSubmit(formValues, formState)} />
    </form>
  );
}

describe('formValidation', () => {
  describe('validationSchema', () => {
    initUseForm({
      schemaValidator: (schema, values, fieldName) => {
        return [errors.firstNameRequired];
      }
    });

    it('validationSchema - initial validation', () => {
      const onSubmit = jest.fn();
      const formValues = { firstName: 'Ken' };
      const wrapper = mount(
        <Form
          onSubmit={onSubmit}
          initialValues={formValues}
          validationSchema={{
            firstName: { required: true }
          }}
        />
      );
      const button = wrapper.find('#submit');
      button.prop('onSubmit')();
      expect(onSubmit.mock.calls).toHaveLength(1);
      const [values, state] = onSubmit.mock.calls[0];
      expect(values).toEqual(formValues);
      expect(state).toMatchObject({
        touched: [],
        errors: [errors.firstNameRequired],
        isValid: false
      });
    });
  });
  describe('validateForm - initial validation', () => {
    it('validateForm', () => {
      const onSubmit = jest.fn();
      const formValues = { firstName: 'Ken' };
      const wrapper = mount(
        <Form
          onSubmit={onSubmit}
          initialValues={formValues}
          validateForm={() => [errors.firstNameRequired]}
        />
      );
      const button = wrapper.find('#submit');
      button.prop('onSubmit')();
      expect(onSubmit.mock.calls).toHaveLength(1);
      const [values, state] = onSubmit.mock.calls[0];
      expect(values).toEqual(formValues);
      expect(state).toMatchObject({
        touched: [],
        errors: [errors.firstNameRequired],
        isValid: false
      });
    });
  });
});
