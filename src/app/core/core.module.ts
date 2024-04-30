import { NgModule } from '@angular/core';
import { RouterModule } from '@angular/router';
import { BaseComponent } from './components/base/base.component';
import { TableComponent } from './components/table/table.component';
import { AuthInterceptor } from './interceptors/auth.interceptor';
import { HeaderComponent } from './layout/header/header.component';
import { MainLayoutComponent } from './layout/main-layout/main-layout.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ContainerComponent } from './layout/container/container.component';
import { CommonModule } from '@angular/common';
import INTERCEPTORS from './interceptors';

@NgModule({
  declarations: [
    BaseComponent,
    TableComponent,
    HeaderComponent,
    MainLayoutComponent,
    FooterComponent,
    ContainerComponent,
  ],
  imports: [RouterModule, CommonModule],
  providers: [...INTERCEPTORS],
  exports: [],
})
export class CoreModule {}
