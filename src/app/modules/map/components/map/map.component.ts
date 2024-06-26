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
import {
  Coordinates,
  CustomTileLayer,
  GeoJSONData,
  LocationData,
  RoutingData,
} from '@shared/interfaces/map.interface';
import { FormControl } from '@angular/forms';
import { MapRoutingComponent } from '../map-routing/map-routing.component';
import { MapSearchBarComponent } from '../map-search-bar/map-search-bar.component';

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.css'],
})
export class MapComponent
  extends BaseComponent
  implements OnInit, AfterViewInit
{
  @ViewChild('mapRouting') mapRoutingComp: MapRoutingComponent;
  @ViewChild('mapSearch') mapSearchComp: MapSearchBarComponent;
  private map: L.Map;
  private drawnItems: L.FeatureGroup<any>;
  private drawControl: L.Control.Draw;

  data: GeoJSONData[] = [];
  searchIcon = L.divIcon({
    className: 'fa-solid fa-location-dot text-3xl text-red-500',
  });
  searchMarker = L.marker([0, 0], { icon: this.searchIcon });
  latLng: Coordinates = null;
  fromMarker: L.Marker;
  toMarker: L.Marker;
  directedRoute: L.GeoJSON;
  viewZoomDefault: number = 12;

  @ViewChild('map') mapElement: ElementRef<HTMLDivElement>;
  @ViewChild('clearModal') clearModal: ElementRef;
  constructor(
    service: ComponentService,
    private mapService: MapService,
    public authService: AuthService
  ) {
    super(service);
  }

  ngOnInit() {
    navigator.geolocation;
    L.Icon.Default.imagePath = 'assets/';
  }

  ngAfterViewInit(): void {
    this.initMap();
    this.addControls();
    this.listenCreateLayer();
    this.listenDeleteLayer();
    this.loadLayer();
    this.listenOnClickMap();
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
    this.drawnItems = new L.FeatureGroup();
    this.map.addLayer(this.drawnItems);

    this.drawControl = new L.Control.Draw({
      draw: {
        rectangle: false,
        circlemarker: false,
      },
      edit: {
        featureGroup: this.drawnItems,
        edit: false,
        remove: false,
      },
    });

    this.drawControl.addTo(this.map);
  }

  generateLayer(data: GeoJSONData): L.Layer {
    const geoJsonData = data;
    geoJsonData.geometry.coordinates = JSON.parse(
      geoJsonData.geometry.coordinates
    );
    delete geoJsonData.id;
    delete geoJsonData.userId;
    let createdLayer: L.GeoJSON;
    if (geoJsonData.properties?.radius) {
      createdLayer = L.geoJSON(geoJsonData as any, {
        pointToLayer: (feature, latlng) => {
          return new L.Circle(latlng, feature.properties.radius);
        },
        onEachFeature: function (feature, layer) {
          const popupContent = `<button class="delete-button btn" data-id=${feature.properties.id}>Remove</button>`;
          layer.bindPopup(popupContent);
        },
      });
    } else {
      createdLayer = L.geoJSON(geoJsonData as any, {
        onEachFeature: function (feature, layer) {
          const popupContent = `<button class="delete-button btn" data-id=${feature.properties.id}>Remove</button>`;
          layer.bindPopup(popupContent);
        },
      });
    }
    return createdLayer;
  }

  loadLayer() {
    this.subscribeUntilDestroy(this.mapService.getLayer(), (res) => {
      this.data = res.data as GeoJSONData[];
      const layers = this.data.map((it) => {
        return this.generateLayer(it);
      });
      layers.forEach((it) => this.drawnItems.addLayer(it));
    });
  }

  listenCreateLayer() {
    this.map.on(L.Draw.Event.CREATED, (event: any) => {
      const layer = event.layer;
      const geoJsonData = this.transformLayerToJson(layer);
      geoJsonData.geometry.coordinates = JSON.stringify(
        geoJsonData.geometry.coordinates
      );
      this.subscribeUntilDestroy(
        this.mapService.createLayer(geoJsonData),
        (res) => {
          const geoJsonResult = res.data as GeoJSONData;
          this.data.push(geoJsonResult);
          const createdLayer = this.generateLayer(geoJsonResult);
          this.drawnItems.addLayer(createdLayer);
        },
        () => {
          this.showError(
            this.trans('common.error'),
            this.trans('common.request.error')
          );
        }
      );
    });
  }

  listenDeleteLayer() {
    this.map.on('popupopen', (event: L.PopupEvent) => {
      const deleteButton = document.querySelector('.delete-button');
      if (!deleteButton) return;
      const layerId = deleteButton.getAttribute('data-id');
      deleteButton.addEventListener('click', () => {
        this.subscribeUntilDestroy(
          this.mapService.deleteLayer(layerId),
          () => {
            this.data = this.data.filter((it) => it.properties.id !== layerId);
            this.map.removeLayer((event.popup as any)._source);
          },
          () => {
            this.showError(
              this.trans('common.error'),
              this.trans('common.request.error')
            );
          }
        );
      });
    });
  }

  onOpenClearLayerModal() {
    this.clearModal.nativeElement.showModal();
  }

  clearLayer() {
    this.subscribeUntilDestroy(
      this.mapService.clearLayer(),
      () => {
        this.drawnItems.clearLayers();
        this.data = [];
      },
      () => {
        this.showError(
          this.trans('common.error'),
          this.trans('common.request.error')
        );
      }
    );
  }

  transformLayerToJson(layer) {
    const json = layer.toGeoJSON() as GeoJSONData;

    if (layer instanceof L.Circle) {
      json.properties.radius = layer.getRadius();
    }
    return json;
  }

  searchLocation(coordinate: Coordinates) {
    this.map.setView([coordinate.lat, coordinate.lng], this.viewZoomDefault);
    this.searchMarker.setLatLng([coordinate.lat, coordinate.lng]);
    this.searchMarker.addTo(this.map);
  }

  viewCurrentLocation() {
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.searchLocation({ lat, lng });
      },
      () => {
        this.showInfo(
          this.trans('map.locationUnable.title'),
          this.trans('map.locationUnable.body')
        );
      }
    );
  }

  addFromMarker(location: LocationData) {
    if (location && location.lat && location.lng) {
      this.fromMarker = L.marker([Number(location.lat), Number(location.lng)])
        .bindPopup(`<b>${this.trans('map.location.from')}</b>`)
        .addTo(this.map);
      this.map.setView([Number(location.lat), Number(location.lng)]);
    } else {
      this.map.removeLayer(this.fromMarker);
    }
  }

  addToMarker(location: LocationData) {
    if (location && location.lat && location.lng) {
      this.toMarker = L.marker([Number(location.lat), Number(location.lng)])
        .bindPopup(`<b>${this.trans('map.location.to')}</b>`)
        .addTo(this.map);
      this.map.setView([Number(location.lat), Number(location.lng)]);
    } else {
      this.map.removeLayer(this.toMarker);
    }
  }

  drawRouting(routingData: RoutingData) {
    const geo = routingData.geo;
    if (geo && geo.coordinates) {
      this.onCancelSearchView();
      if (this.directedRoute != null) this.map.removeLayer(this.directedRoute);
      const geoJson: any = {
        type: 'FeatureCollection',
        features: [
          {
            type: 'Feature',
            properties: {},
            geometry: geo,
          },
        ],
      };
      this.directedRoute = L.geoJSON(geoJson, { style: { weight: 5 } })
        .bindPopup(
          `<b>${this.trans('map.distance', {
            distance: routingData.distance.toFixed(2),
          })}</b>`
        )
        .addTo(this.map);
      this.map.fitBounds(this.directedRoute.getBounds());
    } else {
      this.map.removeLayer(this.directedRoute);
    }
  }

  onCancelSearchView() {
    this.searchMarker.remove();
  }

  scrollIntoView() {
    this.mapElement.nativeElement.scrollIntoView({ behavior: 'smooth' });
  }

  listenOnClickMap() {
    this.map.on('click', (e) => {
      this.latLng = e.latlng;
      this.mapSearchComp.onHideLocation();
      this.mapRoutingComp.onHideToLocationList();
      this.mapRoutingComp.onHideFromLocationList();
    });
  }

  exitRoutingView() {
    if (this.directedRoute != null) this.map.removeLayer(this.directedRoute);
    if (!this.fromMarker) this.map.removeLayer(this.fromMarker);
    if (!this.toMarker) this.map.removeLayer(this.toMarker);
  }
}
