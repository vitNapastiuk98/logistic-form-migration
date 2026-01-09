import {Component, input, output} from '@angular/core';
import { CommonModule } from '@angular/common';
import {ManifestPayload} from '../models/manifest.models';

@Component({
  selector: 'app-new-confirmation-modal',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="fixed inset-0 z-50 overflow-y-auto" aria-labelledby="modal-title" role="dialog" aria-modal="true">
      <div class="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity"></div>

      <div class="flex min-h-full items-end justify-center p-4 text-center sm:items-center sm:p-0">
        <div class="relative transform overflow-hidden rounded-lg bg-white text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-lg">

          <div class="bg-white px-4 pb-4 pt-5 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">

              <div class="mx-auto flex h-12 w-12 flex-shrink-0 items-center justify-center rounded-full bg-green-100 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-green-600" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>

              <div class="mt-3 text-center sm:ml-4 sm:mt-0 sm:text-left w-full">
                <h3 class="text-base font-semibold leading-6 text-gray-900" id="modal-title">Confirm Submission</h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500">Please review your manifest before final submission.</p>

                  <div class="mt-4 bg-gray-50 rounded-md p-3 text-left space-y-2 text-sm border border-gray-200">
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Mode:</span>
                      <span class="uppercase">{{ data()?.meta?.transportMode }}</span>
                    </div>
                    <div class="flex justify-between">
                      <span class="font-medium text-gray-700">Clearance:</span>
                      <span>{{ data()?.meta?.customs?.clearanceCode }}</span>
                    </div>

                    <div class="border-t border-gray-200 pt-2 mt-2">
                      <p class="font-medium text-gray-700 mb-1">Cargo Items ({{ data()?.cargoItems?.length || 0 }})</p>

                      <ul class="space-y-1 pl-2 max-h-32 overflow-y-auto">
                        @for (item of data()?.cargoItems; track $index) {
                          <li class="flex justify-between text-xs text-gray-600">
                            <span>- {{ item.description }}</span>
                            <span class="font-mono">{{ item.weight }}kg</span>
                          </li>
                        } @empty {
                          <li class="text-xs text-gray-400 italic">No cargo items listed</li>
                        }
                      </ul>
                    </div>
                  </div>

                </div>
              </div>
            </div>
          </div>

          <div class="bg-gray-50 px-4 py-3 sm:flex sm:flex-row-reverse sm:px-6">
            <button type="button" (click)="confirm.emit()" class="inline-flex w-full justify-center rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500 sm:ml-3 sm:w-auto">Confirm & Send</button>
            <button type="button" (click)="cancel.emit()" class="mt-3 inline-flex w-full justify-center rounded-md bg-white px-3 py-2 text-sm font-semibold text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 hover:bg-gray-50 sm:mt-0 sm:w-auto">Cancel</button>
          </div>

        </div>
      </div>
    </div>
  `
})
export class NewConfirmationModalComponent {
  data = input<ManifestPayload>()
  confirm = output();
  cancel = output();
}
