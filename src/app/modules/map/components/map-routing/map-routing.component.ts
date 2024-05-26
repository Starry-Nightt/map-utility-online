import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { MapService } from '@modules/map/services/map.service';
import {
  Coordinates,
  LocationData,
  RoutingData,
} from '@shared/interfaces/map.interface';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs';

@Component({
  selector: 'app-map-routing',
  templateUrl: './map-routing.component.html',
  styleUrls: ['./map-routing.component.css'],
})
export class MapRoutingComponent extends BaseComponent implements OnInit {
  private _latLng?: Coordinates = null;
  @Input() get latLng(): Coordinates {
    return this._latLng;
  }
  set latLng(value: Coordinates) {
    this._latLng = value;
    if (this.isRoutingModeOn) {
      if (this.currentFromLocation == null) {
        this.setFromLocation({
          name: `${value.lat} ${value.lng}`,
          lat: value.lat,
          lng: value.lng,
        });
        this.fromKey.setValue(this.currentFromLocation.name, {
          emitEvent: false,
        });
      } else if (this.currentToLocation == null) {
        this.setToLocation({
          name: `${value.lat} ${value.lng}`,
          lat: value.lat,
          lng: value.lng,
        });
        this.toKey.setValue(this.currentToLocation.name, { emitEvent: false });
      }
    }
  }

  @Output() selectFrom = new EventEmitter<LocationData | null>();
  @Output() selectTo = new EventEmitter<LocationData | null>();
  @Output() routingEmitter = new EventEmitter<RoutingData>();
  @Output() exitRouting = new EventEmitter();

  isRoutingModeOn: boolean = false;
  fromKey: FormControl<string> = new FormControl<string>('');
  fromLocations: LocationData[] = [];
  toKey: FormControl<string> = new FormControl<string>('');
  toLocations: LocationData[] = [];
  isOpeningDropdownFromLocation: boolean = false;
  isOpeningDropdownToLocation: boolean = false;
  currentFromLocation: LocationData = null;
  currentToLocation: LocationData = null;
  userLocation: LocationData = null;

  constructor(service: ComponentService, public mapService: MapService) {
    super(service);
  }

  ngOnInit() {
    this.getUserLocation();

    this.fromKey.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => this.mapService.getLocation(res))
      )
      .subscribe((res) => {
        this.fromLocations = res.data;
        if (this.userLocation) this.fromLocations.push(this.userLocation);
      });
    this.toKey.valueChanges
      .pipe(
        debounceTime(300),
        distinctUntilChanged(),
        switchMap((res) => this.mapService.getLocation(res))
      )
      .subscribe((res) => {
        this.toLocations = res.data;
        if (this.userLocation) this.toLocations.push(this.userLocation);
      });
  }

  onRouting() {
    if (!this.currentFromLocation) {
      return;
    }
    if (!this.currentToLocation) {
      return;
    }
    this.subscribeUntilDestroy(
      this.mapService.getRoute({
        startLat: Number(this.currentFromLocation.lat),
        startLng: Number(this.currentFromLocation.lng),
        endLat: Number(this.currentToLocation.lat),
        endLng: Number(this.currentToLocation.lng),
      }),
      (res) => {
        this.routingEmitter.emit(res.data);
      },
      () => {
        this.showError(this.trans('common.error'));
      }
    );
  }

  toggleRouting() {
    this.isRoutingModeOn = !this.isRoutingModeOn;
    if (!this.isRoutingModeOn) {
      this.exitRouting.emit();
      this.onClearFromLocation();
      this.onClearToLocation();
    }
  }

  onShowFromLocationList() {
    this.isOpeningDropdownFromLocation = true;
    this.isOpeningDropdownToLocation = false;
  }

  onShowToLocationList() {
    this.isOpeningDropdownToLocation = true;
    this.isOpeningDropdownFromLocation = false;
  }

  onHideFromLocationList() {
    this.isOpeningDropdownFromLocation = false;
  }

  onHideToLocationList() {
    this.isOpeningDropdownToLocation = false;
  }

  onSelectLocation(location: LocationData, key: string) {
    if (key === 'from') {
      this.fromKey.setValue(location.name, { emitEvent: false });
      this.setFromLocation(location);
      this.onHideFromLocationList();
    } else if (key === 'to') {
      this.toKey.setValue(location.name, { emitEvent: false });
      this.setToLocation(location);
      this.onHideToLocationList();
    }
  }

  setFromLocation(location: LocationData | null) {
    this.currentFromLocation = location;
    this.selectFrom.emit(location);
  }

  setToLocation(location: LocationData | null) {
    this.currentToLocation = location;
    this.selectTo.emit(location);
  }

  onClearFromLocation() {
    this.onHideFromLocationList();
    this.setFromLocation(null);
    this.fromKey.setValue('', { emitEvent: false });
    this.resetFromLocation();
  }

  onClearToLocation() {
    this.onHideToLocationList();
    this.setToLocation(null);
    this.toKey.setValue('', { emitEvent: false });
    this.resetToLocation();
  }

  getUserLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const lat = position.coords.latitude;
        const lng = position.coords.longitude;
        this.userLocation = { lat, lng, name: this.trans('map.location.user') };
        this.resetFromLocation();
        this.resetToLocation();
      });
    }
  }

  resetFromLocation() {
    if (this.userLocation) {
      this.fromLocations = [this.userLocation];
    } else {
      this.fromLocations = [];
    }
  }

  resetToLocation() {
    if (this.userLocation) {
      this.toLocations = [this.userLocation];
    } else {
      this.toLocations = [];
    }
  }
}
