import { Injectable } from '@angular/core';
import { HttpService } from '@core/services/http.service';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpService) {}

  getTile(): string {
    return this.http.prefix + '/map/{z}/{x}/{y}.png';
  }
}
