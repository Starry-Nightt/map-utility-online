import {
  Component,
  ContentChild,
  Input,
  OnInit,
  TemplateRef,
} from '@angular/core';

@Component({
  selector: 'app-data-table',
  templateUrl: './data-table.component.html',
  styleUrls: ['./data-table.component.css'],
})
export class DataTableComponent implements OnInit {
  @Input()
  caption: string;

  @Input()
  columns: { title: string; key: string }[] = [];

  @Input()
  values: any[] = [];

  @Input()
  footerValues: any[] = [];

  @ContentChild('caption', { static: false })
  captionTemplate: TemplateRef<any>;

  @ContentChild('header', { static: false })
  headerTemplate: TemplateRef<any>;

  @ContentChild('body', { static: false })
  bodyTemplate: TemplateRef<any>;

  @ContentChild('footer', { static: false })
  footerTemplate: TemplateRef<any>;

  constructor() {}

  ngOnInit() {}
}
