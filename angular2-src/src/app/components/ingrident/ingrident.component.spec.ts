/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { IngridentComponent } from './ingrident.component';

describe('IngridentComponent', () => {
  let component: IngridentComponent;
  let fixture: ComponentFixture<IngridentComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ IngridentComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(IngridentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
