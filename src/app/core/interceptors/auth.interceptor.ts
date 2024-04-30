import {
  HttpInterceptor,
  HttpRequest,
  HttpHandler,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ComponentService } from '@core/services/component.service';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  constructor(private service: ComponentService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler) {
    const authToken = this.service.storage.getItem('token');
    if (!authToken) return next.handle(req);
    const authReq = req.clone({
      headers: req.headers.set('Authorization', `Bearer ${authToken}`),
    });

    return next.handle(authReq);
  }
}
