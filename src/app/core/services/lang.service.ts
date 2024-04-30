import { Injectable } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root',
})
export class LangService {
  constructor(
    public translate: TranslateService,
    public storage: StorageService
  ) {}

  switchLang(lang: string) {
    this.storage.setItem('lang', lang);
    this.translate.use(lang);
  }
}
