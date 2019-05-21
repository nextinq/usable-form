/* eslint-disable no-unused-vars */
import * as React from 'react';
import { mount } from 'enzyme';
import { useForm } from '../index';

const company = {
  name: 'My Company',
  country: {
    code: 'us'
  }
};

const otherCompany = {
  name: 'Other Company',
  country: {
    code: 'cz'
  }
};

function TestForm() {
  const { setupField, setFieldValue, formValues, setValues } = useForm({
    initialValues: company
  });
  return (
    <form>
      {JSON.stringify(formValues)}
      <button
        id="set-country"
        onClick={() => setFieldValue('country.code', 'cz')}
      />
      <button id="set-values" onClick={() => setValues(otherCompany)} />
      <input {...setupField('name')} />
      <input {...setupField('country.code')} />
    </form>
  );
}

describe('nestedFields', () => {
  it('nested fields - initialValues', () => {
    const wrapper = mount(<TestForm />);
    const name = wrapper.find('#name');
    const country = wrapper.find('#country__code');
    expect(name).toHaveLength(1);
    expect(country).toHaveLength(1);
    expect(name.prop('value')).toEqual('My Company');
    expect(country.prop('value')).toEqual('us');
  });

  it('change nested field', () => {
    const wrapper = mount(<TestForm />);
    const country = wrapper.find('#country__code');
    expect(country).toHaveLength(1);
    country.prop('onChange')({ currentTarget: { value: 'cz' } });
    country.update();
    expect(wrapper.find('#country__code').prop('value')).toEqual('cz');
  });

  it('set nested field programmatically', () => {
    const wrapper = mount(<TestForm />);
    wrapper.find('#set-country').simulate('click');
    const country = wrapper.find('#country__code');
    expect(country).toHaveLength(1);
    expect(country.prop('value')).toEqual('cz');
  });
  it('reset nested form values', () => {
    const wrapper = mount(<TestForm />);
    wrapper.find('#set-values').simulate('click');
    const country = wrapper.find('#country__code');
    const name = wrapper.find('#name');
    expect(name).toHaveLength(1);
    expect(country).toHaveLength(1);
    expect(country.prop('value')).toEqual('cz');
    expect(name.prop('value')).toEqual('Other Company');
  });
});
