import {AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn} from '@angular/forms';
import {map, Observable, of, switchMap, timer} from 'rxjs';
import {ClearanceService} from '../services/clearence';

export const hazardousCargoValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const isHazardous = control.get('isHazardous')?.value;
  const hazardClass = control.get('hazardClass')?.value;

  if (isHazardous && !hazardClass) {
    return { hazardClassRequired: true };
  }
  return null;
};

export function clearanceCodeValidator(service: ClearanceService): AsyncValidatorFn {
  return (control: AbstractControl): Observable<ValidationErrors | null> => {
    if (!control.value) {
      return of(null);
    }

    return timer(500).pipe(
      switchMap(() => service.validateClearanceCode(control.value)),
      map(isInvalid => (isInvalid ? {blockedCode: true} : null))
    );
  };
}
