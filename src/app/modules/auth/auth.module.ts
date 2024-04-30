import { NgModule } from '@angular/core';
import { AuthRoutingModule } from './auth-routing.module';
import { SharedModule } from '@shared/shared.module';
import { AuthContainerComponent } from './components/auth-container/auth-container.component';
import { LoginComponent } from './components/login/login.component';
import { RegisterComponent } from './components/register/register.component';
import { CommonModule } from '@angular/common';

@NgModule({
  imports: [AuthRoutingModule, SharedModule, CommonModule],
  declarations: [AuthContainerComponent, LoginComponent, RegisterComponent],
})
export class AuthModule {}
