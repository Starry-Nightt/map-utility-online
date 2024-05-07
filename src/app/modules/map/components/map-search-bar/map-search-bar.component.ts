import {
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormControl } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { MapService } from '@modules/map/services/map.service';
import { Coordinates, LocationData } from '@shared/interfaces/map.interface';
import { isNumber } from '@shared/utilities/helper';
import { debounceTime, distinctUntilChanged, switchMap, timer } from 'rxjs';

@Component({
  selector: 'app-map-search-bar',
  templateUrl: './map-search-bar.component.html',
  styleUrls: ['./map-search-bar.component.css'],
})
export class MapSearchBarComponent extends BaseComponent implements OnInit {
  searchKey: FormControl<string> = new FormControl<string>('');
  isSearchView: boolean = false;
  locations: LocationData[] = [];
  isShowLocation: boolean = false;
  currentLocation?: LocationData;
  lastSearchLocation: LocationData[] = [];

  @Output() search = new EventEmitter<Coordinates>();
  @Output() cancelSearch = new EventEmitter();
  constructor(service: ComponentService, public mapService: MapService) {
    super(service);
  }

  ngOnInit() {
    this.searchKey.valueChanges
      .pipe(
        debounceTime(500),
        distinctUntilChanged(),
        switchMap((res) => this.mapService.getLocation(res))
      )
      .subscribe((res) => {
        this.locations = res.data;
      });
  }

  searchLocation(latitude: string, longitude: string, name?: string) {
    const lat = Number(latitude);
    const lng = Number(longitude);
    if (lat && lng && isNumber(lat) && isNumber(lng)) {
      const result: Coordinates = { lat, lng };
      this.search.emit(result);
      this.isSearchView = true;
      if (name && name.length) {
        console.log('in');
        this.searchKey.setValue(name, { emitEvent: false });
        this.currentLocation = this.locations.find((it) => it.city === name);
        if (
          this.lastSearchLocation.every((it) => it.city !== name) ||
          this.lastSearchLocation.length == 0
        ) {
          this.lastSearchLocation.unshift(this.currentLocation);
          if (this.lastSearchLocation.length > 5) this.lastSearchLocation.pop();
        }
      }
      this.onHideLocation();
    }
  }

  handleActionSearchLocationByString() {
    const key = this.searchKey.value;
    if (key.trim().length == 0) return;
    const [lat, lng] = key.split(' ');
    if (isNumber(lat) && isNumber(lng)) {
      this.searchLocation(lat, lng);
      return;
    }
    if (this.locations.length == 0) return;
    this.searchLocation(
      this.locations[0].lat,
      this.locations[0].lng,
      this.locations[0].city
    );
  }

  onCancelSearchView() {
    this.cancelSearch.emit();
    this.isSearchView = false;
    this.searchKey.setValue('');
    this.currentLocation = null;
  }

  isSearchRecently(l: LocationData): boolean {
    return this.lastSearchLocation.findIndex((it) => it.id === l.id) != -1;
  }

  onShowLocation() {
    this.isShowLocation = true;
  }

  onHideLocation() {
    this.isShowLocation = false;
  }
}
