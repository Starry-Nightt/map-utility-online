import {
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { MapService } from '@modules/map/services/map.service';
import { GeoJSONData } from '@shared/interfaces/map.interface';
import { Observable, Subscriber } from 'rxjs';

@Component({
  selector: 'app-map-edit-layer',
  templateUrl: './map-edit-layer.component.html',
  styleUrls: ['./map-edit-layer.component.css'],
})
export class MapEditLayerComponent implements OnInit {
  @Input() layer: GeoJSONData;
  @Output() submit = new EventEmitter<GeoJSONData>();
  @Output() close = new EventEmitter();
  @ViewChild('fileUpload') fileUpload: ElementRef<HTMLInputElement>;

  imageBase64: string;
  form = this.fb.group({
    title: [''],
    description: [''],
    image: [''],
  });

  constructor(private fb: FormBuilder) {}

  ngOnInit() {
    this.form.setValue(
      this.layer.properties?.body ?? { title: '', description: '', image: null }
    );
    this.imageBase64 = this.layer.properties?.body?.image;
  }

  get titleCtrl() {
    return this.form.get('title');
  }

  get descriptionCtrl() {
    return this.form.get('description');
  }

  get imageCtrl() {
    return this.form.get('image');
  }

  onUpdate() {
    const newProperties = {
      ...this.layer.properties,
      body: this.form.value,
    };
    const newGeoJsonData: GeoJSONData = {
      ...this.layer,
      properties: newProperties,
    };
    this.submit.emit(newGeoJsonData);
  }

  onClose() {
    this.close.emit();
  }

  onFileSelected(event) {
    const file: File = event.target.files[0];
    this.convertToBase64(file);
  }

  convertToBase64(file: File) {
    const observable = new Observable((subscriber) => {
      this.readFile(file, subscriber);
    });
    observable.subscribe((base64) => {
      this.imageBase64 = base64 as string;
      this.imageCtrl.setValue(this.imageBase64);
    });
  }

  readFile(file: File, subscriber: Subscriber<string>) {
    const fileReader = new FileReader();
    fileReader.readAsDataURL(file);
    fileReader.onload = () => {
      subscriber.next(fileReader.result as string);
      subscriber.complete();
    };
    fileReader.onerror = (error) => {
      subscriber.error(error);
      subscriber.complete();
    };
  }

  onChangeImage() {
    this.fileUpload.nativeElement.click();
  }
}
