import { ComponentService } from './../../../../core/services/component.service';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { AuthService } from '@modules/auth/services/auth.service';

@Component({
  selector: 'app-profile-settings',
  templateUrl: './profile-settings.component.html',
  styleUrls: ['./profile-settings.component.css'],
})
export class ProfileSettingsComponent extends BaseComponent implements OnInit {
  @ViewChild('deleteAccountModal') deleteAccountModal: ElementRef;
  constructor(service: ComponentService, public authService: AuthService) {
    super(service);
  }

  ngOnInit() {}

  deleteAccount() {
    this.subscribeUntilDestroy(
      this.authService.deleteAccount(),
      () => {
        this.authService.logout();
        this.redirect(['/auth']);
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.deleteAccount.success')
        );
      },
      () => {
        this.showError(
          this.trans('common.error'),
          this.trans('common.request.error')
        );
      }
    );
  }

  onDeleteAccount() {
    this.deleteAccountModal.nativeElement.showModal();
  }
}
