import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { UserService } from '@modules/user-management/services/user.service';
import { UserInfo } from '@shared/interfaces/user.interface';
import { Observable, filter, map } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent extends BaseComponent implements OnInit {
  @ViewChild('deleteAccountModal') deleteAccountModal: ElementRef;
  pageSize: number = 10;
  page: number = 1;
  users$: Observable<UserInfo[]>;
  selectedUser: UserInfo = null;
  columns = [
    { title: 'userList.id', key: 'id' },
    { title: 'userList.username', key: 'username' },
    { title: 'userList.email', key: 'email' },
    { title: 'userList.firstName', key: 'firstName' },
    { title: 'userList.lastName', key: 'lastName' },
    { title: 'userList.role', key: 'role' },
    { title: 'userList.action', key: 'action' },
  ];

  constructor(service: ComponentService, public userService: UserService) {
    super(service);
  }

  ngOnInit() {
    this.getUsers();
  }

  onCreateUser() {
    this.redirect('user/create');
  }

  onDeleteUser(user: UserInfo) {
    this.selectedUser = user;
    this.deleteAccountModal.nativeElement.showModal();
  }

  getUsers() {
    this.users$ = this.userService.getAll().pipe(
      filter((res) => res.success),
      map((res) => res.data)
    );
  }

  deleteUser(id: string) {
    this.subscribeUntilDestroy(
      this.userService.deleteById(id),
      () => {
        this.showSuccess(
          this.trans('common.success'),
          this.trans('auth.deleteAccount.success')
        );
        this.selectedUser = null;
        this.getUsers();
      },
      () => {
        this.showError(
          this.trans('common.error'),
          this.trans('common.request.error')
        );
      }
    );
  }
}
