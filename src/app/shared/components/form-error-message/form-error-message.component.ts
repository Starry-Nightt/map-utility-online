import { Component, Input, OnInit } from '@angular/core';
import { AbstractControl, FormControl } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';

@Component({
  selector: 'app-form-error-message',
  templateUrl: './form-error-message.component.html',
  styleUrls: ['./form-error-message.component.css'],
})
export class FormErrorMessageComponent extends BaseComponent implements OnInit {
  @Input() control: FormControl | AbstractControl;
  @Input() fieldName: string;

  constructor(service: ComponentService) {
    super(service);
  }

  ngOnInit() {}

  getMessage() {
    let message = '';
    if (!this.control.errors) return message;
    if (this.control.errors['required'])
      message = this.trans('validator.required', {
        fieldName: this.fieldName,
      });
    if (this.control.errors['email']) message = this.trans('validator.email');
    if (this.control.errors['pattern'])
      message = this.trans('validator.pattern', { fieldName: this.fieldName });
    return message;
  }
}
