/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { TextCopyComponent } from './text-copy.component';

describe('TextCopyComponent', () => {
  let component: TextCopyComponent;
  let fixture: ComponentFixture<TextCopyComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ TextCopyComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(TextCopyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
