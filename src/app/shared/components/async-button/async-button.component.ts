import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-async-button',
  templateUrl: './async-button.component.html',
  styleUrls: ['./async-button.component.css'],
})
export class AsyncButtonComponent implements OnInit {
  @Input() class?: string;
  @Input() loading?: boolean = false;
  @Input() disabled?: boolean = false;
  @Input() type?: string = 'button';
  @Output() click = new EventEmitter();
  constructor() {}

  ngOnInit() {}
}
