import { Injectable } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { SuccessResponse } from '@shared/interfaces/response';
import { UserCreateDetail, UserInfo } from '@shared/interfaces/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class UserService {
  constructor(private http: HttpService, private authService: AuthService) {}

  create(detail: UserCreateDetail): Observable<SuccessResponse<UserInfo>> {
    return this.http.post('/user', detail);
  }

  getAll(): Observable<SuccessResponse<UserInfo[]>> {
    return this.http.get('/user');
  }

  getById(id: string): Observable<SuccessResponse<UserInfo>> {
    return this.http.get(`/user/${id}`);
  }

  deleteById(id: string): Observable<SuccessResponse<UserInfo>> {
    return this.http.delete(`/user/${id}`);
  }
}
