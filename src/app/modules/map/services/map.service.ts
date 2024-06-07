import { AuthService } from './../../auth/services/auth.service';
import { Injectable } from '@angular/core';
import { HttpService } from '@core/services/http.service';
import {
  GeoJSONData,
  LocationData,
  RoutingData,
  RoutingDetail,
} from '@shared/interfaces/map.interface';
import { SuccessResponse } from '@shared/interfaces/response';
import { Observable, map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MapService {
  constructor(private http: HttpService, private authService: AuthService) {}

  getTile(): string {
    return this.http.prefix + '/map/{z}/{x}/{y}.png';
  }

  getLayer(): Observable<SuccessResponse<GeoJSONData[]>> {
    return this.http.get(`/map/${this.authService.currentUser.id}`);
  }

  createLayer(body: GeoJSONData): Observable<SuccessResponse<GeoJSONData>> {
    return this.http.post(`/map/${this.authService.currentUser.id}`, body);
  }

  deleteLayer(id: string): Observable<void> {
    return this.http.delete(`/map/${id}`);
  }

  clearLayer(): Observable<void> {
    return this.http.delete(`/map/clear/${this.authService.currentUser.id}`);
  }

  getLocation(key: string): Observable<SuccessResponse<LocationData[]>> {
    return this.http.get(`/osm/location/?key=${key}`);
  }

  getRoute(detail: RoutingDetail): Observable<SuccessResponse<RoutingData>> {
    return this.http.post('/osm/routing', detail).pipe(
      map((res: SuccessResponse<any>) => {
        return {
          ...res,
          data: {
            ...res.data,
            geo: JSON.parse(res.data?.geo),
          },
        };
      })
    );
  }
}
