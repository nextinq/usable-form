import { FormState, ValidationError } from './types';

export const baseError: ValidationError = {
  source: 'base',
  code: 'base',
  severity: 'Error'
};

type SaveFormData<TErrorResponseData = unknown> = {
  action: () => Promise<void>;
  formState?: FormState;
  apiErrorsMapper?: (errorResponseData: TErrorResponseData) => Array<ValidationError>;
  onValidationError?: (errors: Array<ValidationError>, response: unknown) => void;
  onUnknownError?: (response: unknown) => void;
};

/**
 * Helper coroutine to save form.
 * It handles form validation and failed responses.
 * @param data {SaveFormData}
 */
export async function saveRestApiForm<TErrorResponseData>(
  data: SaveFormData<TErrorResponseData>
): Promise<void> {
  try {
    await data.action();
  } catch (e) {
    const formState = data && data.formState;
    const setFormErrors = formState && formState.setFormErrors;
    let apiErrors = [baseError];
    if (e.response && (e.response.status === 400 || e.response.status === 422)) {
      const errorResponseData = e.response.data;
      // eslint-disable-next-line no-console
      console.warn('Error response: ', errorResponseData);
      if (data.apiErrorsMapper) {
        apiErrors = data.apiErrorsMapper(e.response);
      }
      if (setFormErrors) {
        setFormErrors(apiErrors);
      }
      if (data.onValidationError) {
        data.onValidationError(apiErrors, e.response);
      }
    } else {
      if (data.onUnknownError) {
        data.onUnknownError(e);
      }
    }
  }
}
