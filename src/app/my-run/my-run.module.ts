import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { MyRunPageRoutingModule } from './my-run-routing.module';

import { MyRunPage } from './my-run.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    MyRunPageRoutingModule
  ],
  declarations: [MyRunPage]
})
export class MyRunPageModule {}
