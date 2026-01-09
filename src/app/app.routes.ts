import { Routes } from '@angular/router';
import {ManifestComponent} from './reative/views/manifest';
import {NewManifestComponent} from './signal/views/manifest';

export const routes: Routes = [
  {path: '', component: ManifestComponent},
  {path: 'signal', component: NewManifestComponent },
];
