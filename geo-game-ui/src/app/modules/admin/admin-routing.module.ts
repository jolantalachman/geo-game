import { RouterModule, Routes } from '@angular/router';
import { NgModule } from '@angular/core';
import { MainPageComponent } from './pages';
import { ActivityLogComponent, UsersComponent } from './pages/main-page/components';

const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    component: MainPageComponent,
  },
  {
    path: '**',
    redirectTo: '',
    pathMatch: 'full',
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
  providers: [],
})
export class AdminRoutingModule {}

export const routedComponents = [MainPageComponent, ActivityLogComponent, UsersComponent];
