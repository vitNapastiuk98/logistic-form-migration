import { Injectable } from '@angular/core';
import { delay, map, of } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class ClearanceService {

  validateClearanceCode(code: string) {
    const isInvalid = code.toUpperCase() === 'BLOCKED_123';

    return of(isInvalid).pipe(
      delay(2000)
    );
  }
}
