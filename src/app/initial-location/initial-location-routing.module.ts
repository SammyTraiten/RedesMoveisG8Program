import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { InitialLocationPage } from './initial-location.page';

const routes: Routes = [
  {
    path: '',
    component: InitialLocationPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class InitialLocationPageRoutingModule {}
