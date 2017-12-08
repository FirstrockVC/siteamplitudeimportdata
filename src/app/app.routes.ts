import { ModuleWithProviders } from '@angular/core';
import { Routes, RouterModule, PreloadAllModules } from '@angular/router';
import { UploadFileComponent } from './components/uploadFile/uploadFile.component';

const routes: Routes = [
  { path: '', component: UploadFileComponent},
];

export const Routing: ModuleWithProviders = RouterModule.forRoot(routes, { useHash: true, preloadingStrategy: PreloadAllModules });
