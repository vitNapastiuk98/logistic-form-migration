import { Injectable } from '@angular/core';
import { delay, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClearanceService {


  validateClearanceCode(code: string) {
    const isValid = code.toUpperCase() !== 'BLOCKED_123';

    return of(isValid).pipe(
      delay(2000)
    );
  }

}
