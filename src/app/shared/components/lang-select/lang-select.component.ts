import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { LangService } from '@core/services/lang.service';
import { StorageService } from '@core/services/storage.service';
import { LANG } from '@shared/utilities/enums';

@Component({
  selector: 'app-lang-select',
  templateUrl: './lang-select.component.html',
  styleUrls: ['./lang-select.component.css'],
})
export class LangSelectComponent extends BaseComponent implements OnInit {
  langs = [
    {
      id: LANG.EN,
      label: 'English',
    },
    {
      id: LANG.VN,
      label: 'Tiếng Việt',
    },
  ];

  constructor(service: ComponentService, public langService: LangService) {
    super(service);
  }

  ngOnInit() {}

  onChangeLang(event: any) {
    this.langService.switchLang(event.target.value);
  }
}
