import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HeartPageRoutingModule } from './heart-routing.module';

import { HeartPage } from './heart.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    HeartPageRoutingModule
  ],
  declarations: [HeartPage]
})
export class HeartPageModule {}
