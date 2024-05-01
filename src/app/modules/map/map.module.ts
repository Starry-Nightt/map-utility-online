import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SharedModule } from '@shared/shared.module';
import { MapRoutingModule } from './map-routing.module';
import { MapComponent } from './components/map/map.component';

@NgModule({
  imports: [CommonModule, SharedModule, MapRoutingModule],
  declarations: [MapComponent],
})
export class MapModule {}
