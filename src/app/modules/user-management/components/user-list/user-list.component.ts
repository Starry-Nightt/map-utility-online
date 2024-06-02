import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, Validators } from '@angular/forms';
import { BaseComponent } from '@core/components/base/base.component';
import { ComponentService } from '@core/services/component.service';
import { UserService } from '@modules/user-management/services/user.service';
import { PaginateQuery } from '@shared/interfaces/common.interface';
import { ListSuccessResponse } from '@shared/interfaces/response';
import { UserInfo } from '@shared/interfaces/user.interface';
import { DatatableComponent } from '@swimlane/ngx-datatable';
import { Observable, filter, map, switchMap } from 'rxjs';

@Component({
  selector: 'app-user-list',
  templateUrl: './user-list.component.html',
  styleUrls: ['./user-list.component.css'],
})
export class UserListComponent extends BaseComponent implements OnInit {
  @ViewChild('deleteAccountModal') deleteAccountModal: ElementRef;
  @ViewChild(DatatableComponent) table!: DatatableComponent;
  loadingIndicator: boolean = false;
  form = this.fb.group({
    page: [1, [Validators.required]],
    pageSize: [10, [Validators.required]],
    key: [''],
  });
  selectedUser: UserInfo = null;
  rows: UserInfo[] = [];
  total: number = 0;

  constructor(
    service: ComponentService,
    public userService: UserService,
    private fb: FormBuilder
  ) {
    super(service);
  }

  ngOnInit() {
    this.getUsers();
    this.subscribeUntilDestroy(
      this.form.get('page').valueChanges.pipe(
        switchMap((res) =>
          this.userService.paginate({
            ...this.form.value,
            page: res,
          } as PaginateQuery)
        )
      ),
      (res) => {
        this.rows = res.data;
      }
    );
  }

  onCreateUser() {
    this.redirect('user/create');
  }

  onDeleteUser(user: UserInfo) {
    this.selectedUser = user;
    this.deleteAccountModal.nativeElement.showModal();
  }

  getUsers() {
    this.subscribeUntilDestroy(
      this.userService.paginate(this.form.value as PaginateQuery),
      (res: ListSuccessResponse<UserInfo>) => {
        this.rows = res.data;
        this.total = res.total;
      }
    );
  }

  searchUser() {
    this.subscribeUntilDestroy(
      this.userService.paginate({
        ...this.form.value,
        page: 1,
      } as PaginateQuery),
      (res: ListSuccessResponse<UserInfo>) => {
        this.rows = res.data;
        this.total = res.total;
      }
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

  get pageSize() {
    return this.form.get('pageSize').value;
  }

  setPage(value: any) {
    this.form.get('page').setValue(value.offset + 1);
  }
}
