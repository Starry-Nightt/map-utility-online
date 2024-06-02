import { Injectable } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { PaginateQuery } from '@shared/interfaces/common.interface';
import {
  ListSuccessResponse,
  SuccessResponse,
} from '@shared/interfaces/response';
import { UserCreateDetail, UserInfo } from '@shared/interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService) {}

  create(detail: UserCreateDetail): Observable<SuccessResponse<UserInfo>> {
    return this.http.post('/user', detail);
  }

  paginate(query: PaginateQuery): Observable<ListSuccessResponse<UserInfo>> {
    let params = new URLSearchParams();
    for (let key in query) {
      if (query[key] == null || query[key] == '' || query[key] == undefined)
        continue;
      params.set(key, query[key]);
    }
    return this.http.get('/user?' + params.toString());
  }

  getById(id: string): Observable<SuccessResponse<UserInfo>> {
    return this.http.get(`/user/${id}`);
  }

  deleteById(id: string): Observable<SuccessResponse<UserInfo>> {
    return this.http.delete(`/user/${id}`);
  }
}
