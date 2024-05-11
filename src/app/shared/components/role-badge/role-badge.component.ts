import { Component, Input, OnInit } from '@angular/core';
import { AuthService } from '@modules/auth/services/auth.service';
import { Role } from '@shared/utilities/enums';

@Component({
  selector: 'app-role-badge',
  templateUrl: './role-badge.component.html',
  styleUrls: ['./role-badge.component.css'],
})
export class RoleBadgeComponent implements OnInit {
  @Input() role: Role;
  @Input() forTable?: boolean = false;
  constructor() {}

  ngOnInit() {}

  getBadgeColor(): string {
    if (this.role === Role.Admin) return 'badge-accent';
    return 'badge-ghost';
  }
}
