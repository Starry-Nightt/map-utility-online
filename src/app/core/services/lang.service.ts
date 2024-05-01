import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';
import { LANG } from '@shared/utilities/enums';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  lang: string;
  constructor(
    public translate: TranslateService,
    public storage: StorageService
  ) {
    this.lang = this.storage.getItem('lang') ?? LANG.EN;
    this.switchLang(this.lang);
  }

  switchLang(lang: string) {
    this.lang = lang;
    this.storage.setItem('lang', lang);
    this.translate.use(lang);
  }
}
