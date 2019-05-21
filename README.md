[![Build Status](https://travis-ci.org/jkaramon/usable-form.svg?branch=master)](https://travis-ci.org/jkaramon/usable-form)
[![Coverage Status](https://coveralls.io/repos/github/jkaramon/usable-form/badge.svg?branch=master)](https://coveralls.io/github/jkaramon/usable-form?branch=master)

**[Status]: Experimental / Alpha**

# usable-form

A simple React form hook.

## Features

- Works with standard react inputs - no custom components needed
- Should work with any validation library

# Installation

```bash
yarn add usable-form
```

or

```bash
npm install usable-form
```

# Examples

## Basic Usage

```jsx harmony
import * as React from 'react';
import { useForm } from 'usable-form';

function Form() {
  const { setupField, formValues } = useForm({
    initialValues: {
      firstName: 'Joe'
    }
  });
  return (
    <form>
      <input {...setupField('firstName')} />
      <button
        type="submit"
        onSubmit={() => {
          console.log(formValues); // { firstName: 'Joe' }
        }}
      />
    </form>
  );
}
```

## Nested fields

```jsx harmony
import * as React from 'react';
import { useForm } from 'usable-form';

function Form() {
  const { setupField, formValues } = useForm({
    initialValues: {
      firstName: 'Joe',
      bankAccount: {
        number: '0123456789'
      }
    }
  });
  return (
    <form>
      <input {...setupField('firstName')} />
      <input {...setupField('bankAccount.number')} />
      <button
        type="submit"
        onSubmit={() => {
          console.log(formValues); // { firstName: 'Joe', bankAccount: { number: '0123456789' } }
        }}
      />
    </form>
  );
}
```

## Imperative Validation

```jsx harmony
import * as React from 'react';
import { useForm } from 'usable-form';

function Form() {
  const { setupField, formState } = useForm({
    initialValues: {
      firstName: 'Joe'
    },

    /** validation function
     *
     * @param values - actual form values
     * @param fieldName - (optional) field which triggered validation
     * @return Array<ValidationError>
     */
    validateForm: (values, fieldName) => {
      const errors = [];
      if (values.firstName !== 'Joe') {
        errors.push({
          source: 'firstName',
          code: 'only-joe-allowed',
          severity: 'error' // ('error' | 'warning')
        });
      }
      return errors;
    }
  });
  return (
    <form>
      <input {...setupField('firstName')} />
      <button
        type="submit"
        onSubmit={() => {
          console.log(formState); // { isValid: false, errors: [{ source: 'firstName', code: 'only-joe-allowed' ... } ...] }
        }}
      />
    </form>
  );
}
```

## Schema Validation

```jsx harmony
import * as React from 'react';
import { useForm, initUseForm } from 'usable-form';

// Initialize once on application start-up
initUseForm({
  /** If defined, this function could adapt to
   * to a schema validation library of your choice.
   *
   * @param schema - a schema object which your validation library understands
   * @param values - an actual form values
   * @param fieldName - (optional) field which triggered validation
   * @return Array<ValidationError> - empty if valid
   */
  schemaValidator: (schema, values, fieldName) => {
    // TODO: execute validation and return validation errors for the current form values
    return [];
  }
});

function Form() {
  const { setupField, formState } = useForm({
    initialValues: {
      firstName: 'Joe'
    },
    validationSchema: { firstName: { required: true } }
  });
  return (
    <form>
      <input {...setupField('firstName')} />
      <button
        type="submit"
        onSubmit={() => {
          console.log(formState);
        }}
      />
    </form>
  );
}
```

# API

### useForm

useForm hook keeps information about actual form values
and form state.

```flow js
type ValidationError = {
  source: string,
  code: string,
  message?: string,
  severity: 'error' | 'warning' | string
};

type UseFormOptions = {
  initialValues?: FormValues,
  validationSchema?: Object,
  validateForm?: (
    formValues: FormValues,
    fieldName: ?string
  ) => Array<ValidationError>
};

type UseFormResult = {
  setupField: (fieldName: string) => SetupFieldResult,
  setupWrapper: (fieldName: string, locPrefix?: string) => SetupWrapperResult,
  setFieldValue: (fieldName: string, value: any) => void,
  formValues: FormValues,
  formState: FormState,
  setValues: (values: Object) => void
};

const useFormOptions: UseFormOptions = {};
const useFormResult: UseFormResult = useForm(useFormOptions);
```

### setupField

A simple helper function which will return important props to bind an React input field.
It will provide a default implementation for these props:

- name
- id
- value
- onChange
- onBlur

You can override any of these props or even bind them all manually

#### Usage:

```jsx harmony
function Form() {
  const { setupField } = useForm();
  return (
    <form>
      <input {...setupField('firstName')} />
    </form>
  );
}
```

### formValues

Actual form values.

#### Usage:

```jsx harmony
function Form() {
  const { formValues } = useForm();
  .
  .
  .
}
```

### formState

Form meta data. Holds information about validation state and touched fields

#### Usage:

```flow js
type FormState = {
  touched: Array<string>,
  errors: Array<ValidationError>,
  isValid: boolean,
  setFormErrors: (errors: Array<ValidationError>) => void
};

function Form() {
  const { formState } = useForm();
}
```

### setFieldValue

Sets form value imperatively

#### Usage:

```flow js
function Form() {
  const { setupField, setFieldValue } = useForm();
  return (
    <form>
      <input {...setupField('firstName')} />
      <button onClick={() => setFieldValue('firstName', 'Elvis')} />
    </form>
  );
}
```

### setValues

Resets form value imperatively. It will replace all form
values with the new object!

#### Usage:

```jsx harmony
function Form() {
  const { setupField, setValues } = useForm();
  return (
    <form>
      <input {...setupField('firstName')} />
      <button onClick={() => setValues({ firstName: 'Elvis' })} />
    </form>
  );
}
```

### setupWrapper

If you create a component which will
provide at least these props:

```flow js
type WrapperProps = {
  error: ?ValidationError,
  touched: boolean,
  children: Node
};
```

then you can utilize a `setupWrapper` helper function
which will bind a label, field error and field touch status
for you:

```jsx harmony
// Simple InputWrapper
function InputWrapper(props) {
  const { error, touched, label } = props;
  return (
    <div>
      <div className="label">{label}</div>
      <div>{props.children}</div>
      {error && touched && <div className="error">{error}</div>}
    </div>
  );
}

// Form utilizing InputWrapper
function Form() {
  const { setupField, setupWrapper } = useForm();
  return (
    <form>
      <InputWrapper {...setupWrapper('firstName')}>
        <input {...setupField('firstName')} />
      </InputWrapper>
    </form>
  );
}
```
