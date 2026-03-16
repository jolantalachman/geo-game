import { Routes } from '@angular/router';
import { DefaultLayoutComponent } from './layout/layouts';
import { AdminGuard, AuthGuard } from '@shared/guards';

export const routes: Routes = [
  {
    path: '',
    component: DefaultLayoutComponent,
    children: [
      {
        path: 'start',
        pathMatch: 'full',
        loadChildren: () =>
          import('./modules/start/start.module').then(
            (m) => m.StartModule
          ),
      },
      {
        path: 'account',
        pathMatch: 'prefix',
        loadChildren: () =>
          import('./modules/account/account.module').then(
            (m) => m.AccountModule
          ),
        canActivate: [AuthGuard]
      },
      {
        path: 'admin',
        pathMatch: 'prefix',
        loadChildren: () =>
          import('./modules/admin/admin.module').then(
            (m) => m.AdminModule
          ),
        canActivate: [AuthGuard, AdminGuard]
      },
      {
        path: '**',
        redirectTo: 'start',
        pathMatch: 'full',
      },
    ],
  },
];
