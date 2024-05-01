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
import { timer } from 'rxjs';
import 'leaflet-draw';
import { CustomTileLayer, GeoJSONData } from '@shared/interfaces/map.interface';

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

  ngOnInit() {
    L.Icon.Default.imagePath = 'assets/';
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addControls();
    this.subscribeUntilDestroy(timer(100), () => {
      this.scrollIntoView();
    });
  }

  private initMap(): void {
    this.map = L.map('map', {
      center: [39.8282, -98.5795],
      zoom: 3,
    });
    const tiles = new CustomTileLayer(
      this.mapService.getTile(),
      this.authService.token,
      {
        maxZoom: 18,
        minZoom: 3,
      }
    );
    tiles.addTo(this.map);
  }

  addControls() {
    var drawnItems = new L.FeatureGroup();
    this.map.addLayer(drawnItems);
    var drawControl = new L.Control.Draw({
      draw: {
        rectangle: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: drawnItems,
      },
    });
    this.map.addControl(drawControl);

    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layerType = event.layerType;
      const layer = event.layer;
      const myGeoJSON = this.transformLayerToJson(layer);
      let myLayer;
      if (myGeoJSON.properties?.radius) {
        myLayer = L.geoJSON(myGeoJSON as any, {
          pointToLayer: (feature, latlng) => {
            return new L.Circle(latlng, feature.properties.radius);
          },
          onEachFeature: function (feature, layer) {
            // layer.bindPopup('<p>Name: ' + feature.properties.name);
          },
        });
      } else {
        myLayer = L.geoJSON(myGeoJSON as any);
      }
      drawnItems.addLayer(myLayer);
    });

    // this.map.on(L.Draw.Event.EDITED, (event: any) => {
    //   event.layers.eachLayer((layer) => {
    //     console.log(layer.toGeoJSON());
    //   });
    // });

    // this.map.on(L.Draw.Event.DELETED, (event: any) => {
    //   event.layers.eachLayer((layer) => {
    //     console.log(layer.toGeoJSON());
    //   });
    // });
  }

  transformLayerToJson(layer) {
    const json = layer.toGeoJSON() as GeoJSONData;

    if (layer instanceof L.Circle) {
      json.properties.radius = layer.getRadius();
      json.properties.latitude = json.geometry.coordinates[0];
      json.properties.longitude = json.geometry.coordinates[1];
    }

    return json;
  }

  scrollIntoView() {
    this.mapElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }
}
