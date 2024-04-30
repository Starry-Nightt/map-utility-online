import { Injectable } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { StorageService } from './storage.service';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root',
})
export class ComponentService {
  constructor(
    public router: Router,
    public activatedRoute: ActivatedRoute,
    public storage: StorageService,
    public translate: TranslateService,
    public toastr: ToastrService
  ) {}
}
