import {Component, effect, model, signal, untracked} from '@angular/core';
import {Field, form, FormValueControl} from '@angular/forms/signals';
import {Weight} from '../models/manifest.models';

@Component({
  selector: 'app-new-weight-input',
  standalone: true,
  imports: [
    Field,
  ],
  providers: [],
  template: `
    <div class="flex rounded-md shadow-sm">
      <input
        type="number"
        [field]="form.val"

        class="block w-full min-w-0 flex-1 rounded-none rounded-l-md border-gray-300 py-2 px-3 text-gray-900 ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:z-10 focus:ring-2 focus:ring-inset focus:ring-blue-600 sm:text-sm sm:leading-6 disabled:bg-gray-100 disabled:text-gray-500"
        placeholder="0.00"
      >
      <select
        [field]="form.unit"
        class="relative inline-flex items-center rounded-r-md border border-l-0 border-gray-300 bg-gray-50 px-3 py-2 text-sm font-semibold text-gray-900 ring-1 ring-inset ring-gray-300 hover:bg-gray-100 focus:z-10 focus:ring-2 focus:ring-blue-600 focus:outline-none disabled:bg-gray-100 disabled:text-gray-500"
      >
        <option value="kg">KG</option>
        <option value="lbs">LBS</option>
      </select>
    </div>
  `
})
export class NewWeightInputComponent implements FormValueControl<number> {

  readonly value = model(0)

  weight = signal<Weight>({
    unit: 'kg',
    val: 0
  })

  lbsRatio = 0.453592

  constructor() {
    effect(() => {
      const weight = this.weight();
      untracked(() => {
        this.value.set(weight.unit === 'kg' ? weight.val : weight.val * this.lbsRatio);
      })
    })

    effect(() => {
      const parentKg = this.value();
      const currentUnit = this.weight().unit;
      const currentVal = this.weight().val;

      const expectedDisplayVal = currentUnit === 'kg'
        ? parentKg
        : parentKg / this.lbsRatio;

      untracked(() => {
        if (Math.abs(currentVal - expectedDisplayVal) > 0.001) {
          this.weight.update(w => ({...w, val: expectedDisplayVal}));
        }
      });
    });


  }


  form = form(this.weight)


}
