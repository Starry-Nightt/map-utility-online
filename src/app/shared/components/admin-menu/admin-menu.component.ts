import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';

@Component({
  selector: 'app-admin-menu',
  templateUrl: './admin-menu.component.html',
  styleUrls: ['./admin-menu.component.css'],
})
export class AdminMenuComponent extends BaseComponent implements OnInit {
  constructor(service: ComponentService) {
    super(service);
  }

  ngOnInit() {}
}
