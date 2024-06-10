import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import COMPONENTS from './components';
import DIRECTIVES from './directives';
import { RouterModule } from '@angular/router';
import { NgxDatatableModule } from '@swimlane/ngx-datatable';
import { NgOtpInputModule } from 'ng-otp-input';

@NgModule({
  declarations: [...COMPONENTS, ...DIRECTIVES],
  imports: [
    CommonModule,
    ReactiveFormsModule,
    FormsModule,
    TranslateModule,
    RouterModule,
    NgxDatatableModule,
    NgOtpInputModule,
  ],
  exports: [
    ReactiveFormsModule,
    FormsModule,
    NgxDatatableModule,
    ...COMPONENTS,
    TranslateModule,
    ...DIRECTIVES,
    NgOtpInputModule,
  ],
})
export class SharedModule {}
