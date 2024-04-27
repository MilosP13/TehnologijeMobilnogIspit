import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { MyRunPage } from './my-run.page';

const routes: Routes = [
  {
    path: '',
    component: MyRunPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class MyRunPageRoutingModule {}
