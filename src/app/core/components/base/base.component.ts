import { Component } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, finalize, takeUntil } from 'rxjs';
import { ComponentService } from '../../services/component.service';
import { StorageService } from '../../services/storage.service';
import {
  ErrorResponse,
  ListSuccessResponse,
  SuccessResponse,
} from '@shared/interfaces/response';
import { Location } from '@angular/common';

@Component({
  selector: 'app-base',
  templateUrl: './base.component.html',
  styleUrls: ['./base.component.css'],
})
export class BaseComponent {
  private destroy$ = new Subject<void>();
  loading: boolean = false;
  constructor(public componentService: ComponentService) {
    this.translate.setDefaultLang('en');
    this.translate.use(this.localStorage.getItem('lang') || 'en');
  }

  subscribeUntilDestroy(
    observable$: Observable<any>,
    callback: (res: any) => any,
    error?: (param?: ErrorResponse) => any
  ) {
    this.loading = true;
    return observable$
      .pipe(
        takeUntil(this.destroy$),
        finalize(() => (this.loading = false))
      )
      .subscribe(callback, error);
  }

  redirect(path: any, queryParams?: any, replaceUrl = false): void {
    const command = path instanceof Array ? path : [path];
    this.router.navigate(command, { queryParams, replaceUrl });
  }

  trans(str: string, params: object = {}): string {
    return this.translate.instant(str, params);
  }

  showSuccess(title: string, body?: string) {
    this.componentService.toastr.success(body, title);
  }

  showError(title: string, body?: string) {
    this.componentService.toastr.error(body, title);
  }

  showInfo(title: string, body?: string) {
    this.componentService.toastr.info(body, title);
  }

  get router(): Router {
    return this.componentService.router;
  }

  get activatedRoute(): ActivatedRoute {
    return this.componentService.activatedRoute;
  }

  get queryParams(): Params {
    return this.activatedRoute.snapshot.queryParams;
  }

  get routeParams(): Params {
    return this.activatedRoute.snapshot.params;
  }

  get localStorage(): StorageService {
    return this.componentService.storage;
  }

  get translate(): TranslateService {
    return this.componentService.translate;
  }

  goBack() {
    this.componentService.location.back();
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
