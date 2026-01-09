import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-weight-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => WeightInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="flex rounded-md shadow-sm">
      <input
        type="number"
        [(ngModel)]="displayValue"
        (ngModelChange)="update()"
        [disabled]="isDisabled"
        class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500"
        placeholder="0.00"
      >

      <select
        [(ngModel)]="unit"
        (ngModelChange)="update()"
        [disabled]="isDisabled"
        class="relative inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="kg">KG</option>
        <option value="lbs">LBS</option>
      </select>
    </div>
  `
})
export class WeightInputComponent implements ControlValueAccessor {
  displayValue: number = 0;
  unit: 'kg' | 'lbs' = 'kg';
  isDisabled = false;

  private onChange: any = () => {};
  private onTouched: any = () => {};

  writeValue(val: number): void {
    if (val) {
      this.displayValue = val;
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  setDisabledState(isDisabled: boolean): void {
    this.isDisabled = isDisabled;
  }

  update() {
    const normalized = this.unit === 'lbs' ? this.displayValue * 0.45 : this.displayValue;
    this.onChange(normalized);
    this.onTouched();
  }
}
