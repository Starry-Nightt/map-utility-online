import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root',
})
export class HttpService {
  prefix = environment.apiUrl;
  constructor(protected httpClient: HttpClient) {}

  get<T>(url: string, options?: { withCredentials: boolean }): Observable<T> {
    return this.httpClient.get<T>(`${this.prefix}${url}`, options);
  }

  post<T>(
    url: string,
    params: any = {},
    options?: { withCredentials: boolean }
  ): Observable<T> {
    return this.httpClient.post<T>(`${this.prefix}${url}`, params, options);
  }

  put(
    url: string,
    params: any = {},
    options?: { withCredentials: boolean }
  ): Observable<any> {
    return this.httpClient.put(`${this.prefix}${url}`, params, options);
  }

  delete(url: string, options?: { withCredentials: boolean }): Observable<any> {
    return this.httpClient.delete(`${this.prefix}${url}`, options);
  }
}
