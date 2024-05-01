import { Component, OnInit } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styleUrls: ['./header.component.css'],
})
export class HeaderComponent extends BaseComponent implements OnInit {
  shortName: string;
  constructor(service: ComponentService, public authService: AuthService) {
    super(service);
  }

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    this.shortName = currentUser.firstName.charAt(0);
  }

  onViewProfile() {
    this.redirect(['/profile']);
  }
}
