import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ProfileContainerComponent } from './components/profile-container/profile-container.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { ProfilePasswordComponent } from './components/profile-password/profile-password.component';
import { ResetPasswordComponent } from '@modules/auth/components/reset-password/reset-password.component';
import { ProfileResetPasswordComponent } from './components/profile-reset-password/profile-reset-password.component';

const routes: Routes = [
  {
    path: '',
    component: ProfileContainerComponent,
    children: [
      {
        path: 'user',
        component: ProfileUserComponent,
      },
      {
        path: 'change-password',
        component: ProfilePasswordComponent,
      },
      {
        path: 'reset-password',
        component: ProfileResetPasswordComponent,
      },
      {
        path: 'settings',
        component: ProfileSettingsComponent,
      },
      {
        path: '',
        redirectTo: 'user',
        pathMatch: 'full',
      },
    ],
  },
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class ProfileRoutingModule {}
