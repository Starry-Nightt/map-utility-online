import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import COMPONENTS from './components';

@NgModule({
  declarations: [...COMPONENTS],
  imports: [CommonModule, ReactiveFormsModule, FormsModule, TranslateModule],
  exports: [ReactiveFormsModule, FormsModule, ...COMPONENTS, TranslateModule],
})
export class SharedModule {}
