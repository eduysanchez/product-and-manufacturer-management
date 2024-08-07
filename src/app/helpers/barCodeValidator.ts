import { AbstractControl, ValidationErrors, ValidatorFn } from '@angular/forms';

export function barCodeValidator(): ValidatorFn {
  return (control: AbstractControl): ValidationErrors | null => {
    const value = control.value;

    const isValid = /^[0-9]{8}$|^[0-9]{12}$|^[0-9]{13}$|^[0-9]{14}$/.test(
      value
    );

    return isValid ? null : { invalidBarCode: { value } };
  };
}
