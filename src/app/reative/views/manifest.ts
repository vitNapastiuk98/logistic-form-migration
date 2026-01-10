import {Component, OnInit, OnDestroy, inject, signal, ChangeDetectionStrategy} from '@angular/core';
import {
  FormBuilder,
  Validators,
  FormArray,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  FormControlStatus
} from '@angular/forms';
import { Subject, takeUntil, timer } from 'rxjs';
import { CommonModule } from '@angular/common';

import { WeightInputComponent } from './weight-input';
import { ConfirmationModalComponent } from './confirm';
import { hazardousCargoValidator, clearanceCodeValidator } from '../validators/validators';
import { ClearanceService } from '../services/clearence';
import {CargoItemForm, ManifestForm, ManifestPayload, TransportMode} from '../models/manifest.models';

@Component({
  selector: 'app-manifest',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    WeightInputComponent,
    ConfirmationModalComponent,
    CommonModule
  ],
  template: `
    <div class="min-h-screen bg-gray-100 py-10 px-4 sm:px-6 lg:px-8 relative">
      <div class="max-w-3xl mx-auto">

        <div class="mb-8">
          <h1 class="text-3xl font-bold text-gray-900 tracking-tight">Logistics Manifest</h1>
          <p class="mt-2 text-sm text-gray-600">Complete the shipment details below.</p>

          <div class="mt-6 flex items-center justify-between relative">
            <div class="absolute left-0 top-1/2 -z-10 w-full h-1 bg-gray-300 -translate-y-1/2 rounded"></div>
            <div class="flex flex-col items-center bg-gray-100 px-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-200"
                   [class.bg-blue-600]="currentStep() >= 1" [class.text-white]="currentStep() >= 1" [class.bg-gray-300]="currentStep() < 1">1</div>
              <span class="text-xs font-medium mt-1 text-gray-700">Transport</span>
            </div>
            <div class="flex flex-col items-center bg-gray-100 px-2">
              <div class="w-8 h-8 rounded-full flex items-center justify-center font-bold transition-colors duration-200"
                   [class.bg-blue-600]="currentStep() >= 2" [class.text-white]="currentStep() >= 2" [class.bg-gray-300]="currentStep() < 2">2</div>
              <span class="text-xs font-medium mt-1 text-gray-700">Cargo</span>
            </div>
          </div>
        </div>

        <div class="mb-6 flex justify-end">
          <span class="inline-flex items-center gap-x-1.5 rounded-full px-3 py-1 text-xs font-medium ring-1 ring-inset"
                [class.bg-green-50]="formStatus() === 'VALID'"
                [class.text-green-700]="formStatus() === 'VALID'"
                [class.ring-green-600]="formStatus() === 'VALID'"
                [class.bg-red-50]="formStatus() === 'INVALID'"
                [class.text-red-700]="formStatus() === 'INVALID'"
                [class.ring-red-600]="formStatus() === 'INVALID'"
                [class.bg-amber-50]="formStatus() === 'PENDING'"
                [class.text-amber-700]="formStatus() === 'PENDING'"
                [class.ring-amber-600]="formStatus() === 'PENDING'">
            <svg class="h-1.5 w-1.5 fill-current" viewBox="0 0 6 6" aria-hidden="true">
              <circle cx="3" cy="3" r="3" />
            </svg>
            Status: {{ formStatus() }}
            @if (formStatus() === 'PENDING') { <span class="animate-pulse ml-1">...</span> }
          </span>
        </div>

        <form [formGroup]="form" (ngSubmit)="initiateSubmit()" class="bg-white shadow-xl rounded-2xl overflow-hidden border border-gray-100">
          <div class="p-8">
            @switch (currentStep()) {

              @case (1) {
                <div formGroupName="meta" class="space-y-6">
                  <h2 class="text-xl font-semibold text-gray-900 border-b pb-2">Transport & Customs</h2>

                  <div>
                    <label class="block text-sm font-medium leading-6 text-gray-900">Transport Mode</label>
                    <select formControlName="transportMode" class="mt-2 block w-full rounded-md border-0 py-2.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-blue-600 sm:text-sm">
                      <option value="sea">🚢 Sea Freight</option>
                      <option value="air">✈️ Air Freight</option>
                    </select>
                  </div>

                  <div formGroupName="customs" class="bg-gray-50 p-4 rounded-lg border border-gray-200">
                    <label class="block text-sm font-medium text-gray-900">Clearance Code</label>
                    <div class="mt-2 relative">
                      <input placeholder="example BLOCKED_123" formControlName="clearanceCode" class="block w-full rounded-md border-0 py-2.5 pr-10 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-blue-600 sm:text-sm">

                      @let codeCtrl = form.get('meta.customs.clearanceCode');
                      @if (codeCtrl?.pending) {
                        <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                          <svg class="animate-spin h-5 w-5 text-amber-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                            <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                          </svg>
                        </div>
                      }
                    </div>

                    @let codeCtrl2 = form.get('meta.customs.clearanceCode');
                    <div class="mt-2 min-h-[20px]">
                      @if (codeCtrl2?.pending) { <p class="text-xs text-amber-500">Checking...</p> }
                      @if (codeCtrl2?.hasError('blockedCode')) { <p class="text-xs text-red-500">Blocked Code</p> }
                    </div>
                  </div>
                </div>

                <div class="mt-8 flex justify-end">
                  <button type="button" (click)="nextStep()" [disabled]="form.get('meta')?.invalid || form.pending" class="rounded-md bg-blue-600 px-6 py-2.5 text-white text-sm font-semibold hover:bg-blue-500 disabled:opacity-50">Next &rarr;</button>
                </div>
              }

              @case (2) {
                <div class="space-y-6">
                  <div class="flex justify-between border-b pb-2">
                    <h2 class="text-xl font-semibold text-gray-900">Cargo Inventory</h2>
                    <button type="button" (click)="addItem()" class="text-sm font-semibold text-blue-600 hover:text-blue-500">+ Add Item</button>
                  </div>

                  <div formArrayName="cargoItems" class="space-y-4">
                    @for (item of cargoItems.controls; track item; let i = $index) {
                      <div [formGroupName]="i" class="relative group bg-white rounded-lg border border-gray-200 p-6 shadow-sm">
                        <button type="button" (click)="removeItem(i)" class="absolute top-4 right-4 text-gray-400 hover:text-red-600">
                          <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path></svg>
                        </button>
                        <h4 class="text-xs font-bold text-gray-500 uppercase mb-2">Item #{{ i + 1 }}</h4>
                        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <input formControlName="description" placeholder="Description" class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 sm:text-sm">
                          <app-weight-input formControlName="weight"></app-weight-input>

                          <div class="col-span-2 flex items-center gap-2">
                            <input type="checkbox" formControlName="isHazardous" class="h-4 w-4 text-blue-600 rounded">
                            <label class="text-sm text-gray-900">Hazardous?</label>
                            @if(item.get('isHazardous')?.value) {
                              <select formControlName="hazardClass" class="ml-auto block rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-red-300 bg-red-50 text-xs">
                                <option value="">Select Class...</option>
                                <option value="explosive">Explosive</option>
                                <option value="gas">Gas</option>
                              </select>
                            }
                          </div>
                        </div>
                      </div>
                    }
                  </div>

                  <div class="mt-8 flex justify-between pt-6 border-t border-gray-100">
                    <button type="button" (click)="prevStep()" class="text-sm font-semibold text-gray-900">Back</button>
                    <button type="submit" [disabled]="form.invalid || form.pending" class="rounded-md bg-green-600 px-6 py-2.5 text-white text-sm font-semibold hover:bg-green-500 disabled:opacity-50">Review & Submit</button>
                  </div>
                </div>
              }
            }
          </div>
        </form>
      </div>

      @if (showConfirmModal()) {
        <app-confirmation-modal
          [data]="payload()!"
          (confirm)="confirmSubmit()"
          (cancel)="cancelConfirm()">
        </app-confirmation-modal>
      }

      @if (showToast()) {
        <div class="fixed bottom-5 right-5 z-50 animate-slideIn">
          <div class="flex items-center w-full max-w-xs p-4 mb-4 text-gray-500 bg-white rounded-lg shadow">
            <div class="inline-flex items-center justify-center flex-shrink-0 w-8 h-8 text-green-500 bg-green-100 rounded-lg">
              <svg class="w-5 h-5" fill="currentColor" viewBox="0 0 20 20"><path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z"/></svg>
            </div>
            <div class="ml-3 text-sm font-normal">Manifest submitted successfully!</div>
          </div>
        </div>
      }
    </div>
  `,
  styles: [`
    @keyframes slideIn { from { transform: translateY(100%); opacity: 0; } to { transform: translateY(0); opacity: 1; } }
    .animate-slideIn { animation: slideIn 0.3s ease-out forwards; }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ManifestComponent implements OnInit, OnDestroy {
  private fb = inject(FormBuilder);
  private clearanceService = inject(ClearanceService);
  private destroy$ = new Subject<void>();


  showConfirmModal = signal(false);
  showToast = signal(false);
  currentStep = signal(1);
  isAirFreight = signal(false);
  payload = signal<ManifestPayload | null>(null)
  formStatus = signal<FormControlStatus>('PENDING');

  form: FormGroup<ManifestForm> = this.fb.group({
    meta: this.fb.group({
      transportMode: ['sea' as TransportMode, Validators.required],
      customs: this.fb.group({
        clearanceCode: ['', Validators.required, (c: any) => clearanceCodeValidator(this.clearanceService)(c)]
      })
    }),
    cargoItems: this.fb.array<FormGroup<CargoItemForm>>([])
  });

  get cargoItems(): FormArray<FormGroup<CargoItemForm>> { return this.form.get('cargoItems') as FormArray; }

  ngOnInit() {
    this.form.statusChanges.pipe(takeUntil(this.destroy$)).subscribe(s => this.formStatus.set(s));
    this.form.get('meta.transportMode')?.valueChanges.pipe(takeUntil(this.destroy$)).subscribe(mode => {
      this.isAirFreight.set(mode === 'air');
      this.updateWeightValidators(this.isAirFreight());
    });
  }

  private updateWeightValidators(isAir: boolean) {
    const max = isAir ? 500 : 10000;
    this.cargoItems.controls.forEach(c => {
      const w = c.get('weight');
      if(w) { w.setValidators([Validators.required, Validators.max(max)]); w.updateValueAndValidity(); }
    });
  }

  addItem() {
    const max = this.isAirFreight() ? 500 : 10000;
    const g = new FormGroup<CargoItemForm>({
      description: new FormControl('', {
        nonNullable: true,
        validators: [Validators.required]
      }),
      isHazardous: new FormControl<boolean>(false, {
        nonNullable: true
      }),
      hazardClass: new FormControl<any>('', {
        nonNullable: true
      }),
      weight: new FormControl<number | null>(null, [
        Validators.required,
        Validators.max(max)
      ])
    }, { validators: hazardousCargoValidator });

    g.controls.isHazardous.valueChanges
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => g.updateValueAndValidity());

    this.cargoItems.push(g);
  }

  removeItem(i: number) { this.cargoItems.removeAt(i); }

  nextStep() {
    const meta = this.form.get('meta');
    if (meta?.valid && !meta.pending) this.currentStep.set(2);
    else meta?.markAllAsTouched();
  }

  prevStep() { this.currentStep.set(1); }

  initiateSubmit() {
    if (this.form.valid) {
      this.payload.set(this.form.getRawValue() as ManifestPayload);
      this.showConfirmModal.set(true);
    } else {
      this.form.markAllAsTouched();
    }
  }

  confirmSubmit() {
    console.log('API Payload:', this.form.value);
    this.showConfirmModal.set(false);
    this.resetForm();
    this.showToast.set(true);
    timer(3000).pipe(takeUntil(this.destroy$)).subscribe(() => this.showToast.set(false));
  }

  cancelConfirm() {
    this.showConfirmModal.set(false);
  }

  private resetForm() {
    this.cargoItems.clear();
    this.form.reset({ meta: { transportMode: 'sea', customs: { clearanceCode: '' } } });
    this.currentStep.set(1);
    this.isAirFreight.set(false);
  }

  ngOnDestroy() { this.destroy$.next(); this.destroy$.complete(); }
}
