import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HeartPage } from './heart.page';

const routes: Routes = [
  {
    path: '',
    component: HeartPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HeartPageRoutingModule {}
