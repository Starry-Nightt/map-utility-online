import {
  AfterViewInit,
  Component,
  ElementRef,
  OnInit,
  ViewChild,
} from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';
import { MapService } from '@modules/map/services/map.service';
import * as L from 'leaflet';
import { TileLayer } from 'leaflet';
import { timer } from 'rxjs';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  private map: L.Map;
  @ViewChild('map') mapElement: ElementRef<HTMLDivElement>;

  constructor(
    service: ComponentService,
    private mapService: MapService,
    public authService: AuthService
  ) {
    super(service);
  }
  ngAfterViewInit(): void {
    this.initMap();
    this.subscribeUntilDestroy(timer(100), () => {
      this.scrollIntoView();
    });
  }

  ngOnInit() {}

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });
    const tiles = new CustomTileLayer(
      this.mapService.getTileUrl(),
      this.authService.token,
      {
        maxZoom: 18,
        minZoom: 3,
        attribution:
          '&copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
      }
    );

    tiles.addTo(this.map);
  }

  scrollIntoView() {
    this.mapElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}

class CustomTileLayer extends TileLayer {
  token: string;
  constructor(
    urlTemplate: string,
    token: string,
    options?: L.TileLayerOptions
  ) {
    super(urlTemplate, options);
    this.token = token;
  }

  override createTile(coords: L.Coords, done: () => void): HTMLImageElement {
    const url = this.getTileUrl(coords);
    const img = document.createElement('img');
    img.setAttribute('role', 'presentation');

    fetch(url, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${this.token}`,
      },
      mode: 'cors',
    })
      .then((response) => response.blob())
      .then((blob) => {
        const reader = new FileReader();
        reader.onload = () => {
          img.src = reader.result as string;
        };
        reader.readAsDataURL(blob);
        done();
      })
      .catch((error) => {
        console.error('Failed to fetch tile:', error);
        done();
      });

    return img;
  }
}
