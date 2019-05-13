/* eslint-disable no-unused-vars */
import * as React from 'react';
import { mount } from 'enzyme';
import { useForm } from '../index';

function TestInitialValuesForm(props = { initialValues: {} }) {
  const { initialValues } = props;

  const { setupField } = useForm({ initialValues });
  return (
    <form>
      <input {...setupField('firstName')} />
    </form>
  );
}

describe('useForm', () => {
  describe('initialValues', () => {
    it('initialValues', () => {
      const wrapper = mount(
        <TestInitialValuesForm initialValues={{ firstName: 'Ken' }} />
      );
      expect(wrapper.find('#firstName').html()).toContain(`value="Ken"`);
      expect(wrapper.prop('initialValues')).toEqual({
        firstName: 'Ken'
      });
    });

    it('Re-initialize initialValues', () => {
      const wrapper = mount(
        <TestInitialValuesForm initialValues={{ firstName: 'Ken' }} />
      );
      wrapper.setProps({ initialValues: { firstName: 'Barbie' } });
      expect(wrapper.find('#firstName').html()).toContain(`value="Barbie"`);
      expect(wrapper.prop('initialValues')).toEqual({
        firstName: 'Barbie'
      });
    });
  });
});
