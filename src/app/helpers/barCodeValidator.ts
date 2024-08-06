import { AbstractControl } from '@angular/forms';

export const barCodeValidator = (
  control: AbstractControl
): { [key: string]: any } | null => {
  const barcode = control.value;

  if (!barcode || !/^\d+$/.test(barcode)) {
    return { invalidBarcode: true };
  }

  if (![8, 13, 14].includes(barcode.length)) {
    return { invalidBarcode: true };
  }

  return checkDigitValidation(barcode) ? null : { invalidBarcode: true };
};

export const checkDigitValidation = (barcode: string): boolean => {
  let sum = 0;
  const length = barcode.length;
  const checkDigit = parseInt(barcode.charAt(length - 1), 10);

  for (let i = 0; i < length - 1; i++) {
    const num = parseInt(barcode.charAt(i), 10);
    if (length === 8) {
      // EAN-8
      sum += i % 2 === 0 ? num : num * 3;
    } else {
      // EAN-13, EAN-14
      sum += i % 2 === 0 ? num * 3 : num;
    }
  }

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return checkDigit === calculatedCheckDigit;
};
