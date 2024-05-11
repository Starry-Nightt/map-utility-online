import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { UserManagementRoutingModule } from './user-management-routing.module';
import { UserListComponent } from './components/user-list/user-list.component';
import { UserCreateComponent } from './components/user-create/user-create.component';

@NgModule({
  imports: [CommonModule, SharedModule, UserManagementRoutingModule],
  declarations: [UserListComponent, UserCreateComponent],
})
export class UserManagementModule {}
