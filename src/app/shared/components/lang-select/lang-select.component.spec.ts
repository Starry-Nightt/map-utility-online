/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { LangSelectComponent } from './lang-select.component';

describe('LangSelectComponent', () => {
  let component: LangSelectComponent;
  let fixture: ComponentFixture<LangSelectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LangSelectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LangSelectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
