import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './components/map/map.component';
import { MapSearchBarComponent } from './components/map-search-bar/map-search-bar.component';
import { MapRoutingComponent } from './components/map-routing/map-routing.component';

@NgModule({
  imports: [CommonModule, SharedModule, MapRoutingModule],
  declarations: [MapComponent, MapSearchBarComponent, MapRoutingComponent],
})
export class MapModule {}
