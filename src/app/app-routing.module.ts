import { NgModule } from '@angular/core';
import { PreloadAllModules, RouterModule, Routes } from '@angular/router';
import { AdminGuard } from '@core/guards/admin.guard';
import { AuthGuard } from '@core/guards/auth.guard';
import { ContainerComponent } from '@core/layout/container/container.component';

const routes: Routes = [
  {
    path: 'auth',
    loadChildren: () =>
      import('./modules/auth/auth.module').then((m) => m.AuthModule),
  },
  {
    path: '',
    component: ContainerComponent,
    canActivate: [AuthGuard],
    children: [
      {
        path: 'map',
        loadChildren: () =>
          import('./modules/map/map.module').then((m) => m.MapModule),
      },
      {
        path: 'profile',
        loadChildren: () =>
          import('./modules/profile/profile.module').then(
            (m) => m.ProfileModule
          ),
      },
      {
        path: 'user',
        canActivate: [AdminGuard],
        loadChildren: () =>
          import('./modules/user-management/user-management.module').then(
            (m) => m.UserManagementModule
          ),
      },
      {
        path: '',
        redirectTo: 'map',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      preloadingStrategy: PreloadAllModules,
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
