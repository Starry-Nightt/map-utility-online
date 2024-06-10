import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-profile-container',
  templateUrl: './profile-container.component.html',
  styleUrls: ['./profile-container.component.css'],
})
export class ProfileContainerComponent extends BaseComponent implements OnInit {
  @ViewChild('logoutModal') logoutModal: ElementRef;
  items = [
    {
      link: '/profile/user',
      label: 'usernav.profile',
      icon: 'fa-solid fa-user',
    },
    {
      link: '/profile/change-password',
      label: 'usernav.changePassword',
      icon: 'fa-solid fa-key',
    },
    {
      link: '/profile/reset-password',
      label: 'usernav.forget_password',
      icon: 'fa-solid fa-file-shield',
    },
    {
      link: '/profile/settings',
      label: 'usernav.settings',
      icon: 'fa-solid fa-gear',
    },
  ];
  constructor(service: ComponentService, public authService: AuthService) {
    super(service);
  }

  ngOnInit() {}

  isTabActive(link: string) {
    return link === this.router.url;
  }

  get tabActiveLabel() {
    return this.items.find((item) => this.isTabActive(item.link)).label;
  }

  onLogout() {
    this.logoutModal.nativeElement.showModal();
  }

  logout() {
    this.authService.logout();
    this.redirect(['/auth']);
  }

  getBadgeColor(): string {
    if (this.authService.isAdmin) return 'badge-accent';
    return 'badge-ghost';
  }
}
