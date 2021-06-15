import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { InitialLocationPageRoutingModule } from './initial-location-routing.module';

import { InitialLocationPage } from './initial-location.page';


@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InitialLocationPageRoutingModule
  ],
  declarations: [InitialLocationPage]
})
export class InitialLocationPageModule {}
