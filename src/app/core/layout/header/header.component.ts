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
  items = [
    {
      link: '/profile/user',
      label: 'usernav.profile',
      icon: 'fa-solid fa-user',
      isLogout: false,
    },
    {
      link: '/profile/change-password',
      label: 'usernav.changePassword',
      icon: 'fa-solid fa-key',
      isLogout: false,
    },
    {
      link: 'logout',
      isLogout: true,
      label: 'usernav.logout',
      icon: 'fa-solid fa-right-from-bracket',
    },
  ];
  constructor(service: ComponentService, public authService: AuthService) {
    super(service);
  }

  ngOnInit() {
    const currentUser = this.authService.currentUser;
    this.shortName = currentUser.firstName.charAt(0);
  }

  onLogout() {
    this.authService.logout();
    this.redirect(['/auth']);
  }
}
