import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { ProfileContainerComponent } from './components/profile-container/profile-container.component';
import { ProfileUserComponent } from './components/profile-user/profile-user.component';
import { ProfileSettingsComponent } from './components/profile-settings/profile-settings.component';
import { ProfileRoutingModule } from './profile-routing.module';
import { ProfilePasswordComponent } from './components/profile-password/profile-password.component';

@NgModule({
  imports: [CommonModule, SharedModule, ProfileRoutingModule],
  declarations: [
    ProfileContainerComponent,
    ProfileUserComponent,
    ProfileSettingsComponent,
    ProfilePasswordComponent,
  ],
})
export class ProfileModule {}
