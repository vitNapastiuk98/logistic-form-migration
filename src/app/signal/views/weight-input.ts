import { Component, forwardRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR, FormsModule } from '@angular/forms';

@Component({
  selector: 'app-new-weight-input',
  standalone: true,
  imports: [FormsModule],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => NewWeightInputComponent),
      multi: true
    }
  ],
  template: `
    <div class="weight-wrapper">
      <input type="number" [(ngModel)]="displayValue" (ngModelChange)="update()">
      <select [(ngModel)]="unit" (ngModelChange)="update()">
        <option value="kg">KG</option>
        <option value="lbs">LBS</option>
      </select>
    </div>
  `
})
export class NewWeightInputComponent implements ControlValueAccessor {
  displayValue: number = 0;
  unit: 'kg' | 'lbs' = 'kg';

  // The normalized value sent to parent (always in KG)
  private value: number = 0;

  onChange: any = () => {};
  onTouched: any = () => {};

  writeValue(val: number): void {
    if (val) {
      this.value = val;
      this.displayValue = val; // simplified
    }
  }

  registerOnChange(fn: any): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: any): void {
    this.onTouched = fn;
  }

  update() {
    // Complex logic: Convert to KG before sending to parent
    const normalized = this.unit === 'lbs' ? this.displayValue * 0.45 : this.displayValue;
    this.onChange(normalized);
    this.onTouched();
  }
}
