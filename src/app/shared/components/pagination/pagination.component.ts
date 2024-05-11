import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.css'],
})
export class PaginationComponent implements OnInit {
  @Input() size: 'xs' | 'sm' | 'md' | 'lg' = 'sm';
  @Input() total: number;
  @Input() active: number;
  @Output() activeChange = new EventEmitter<number>();

  pages: number[] = [];
  constructor() {}

  ngOnInit() {
    this.pages = Array.from({ length: this.total }, (_, index) => index + 1);
    this.total = Math.floor(this.total);
  }

  onPrevious() {
    if (this.active > 1) {
      this.active = this.active - 1;
      this.activeChange.emit(this.active);
    }
  }

  onNext() {
    if (this.active < this.total) {
      this.active = this.active + 1;
      this.activeChange.emit(this.active);
    }
  }

  onChangePage(page: number) {
    this.active = page;
    this.activeChange.emit(this.active);
  }
}
