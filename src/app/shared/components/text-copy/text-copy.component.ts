import { Component, Input, OnInit } from '@angular/core';

@Component({
  selector: 'app-text-copy',
  templateUrl: './text-copy.component.html',
  styleUrls: ['./text-copy.component.css'],
})
export class TextCopyComponent implements OnInit {
  @Input() text: string;
  constructor() {}

  ngOnInit() {}
}
