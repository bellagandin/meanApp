/* tslint:disable:no-unused-variable */
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

import { UserResaultComponent } from './user-resault.component';

describe('UserResaultComponent', () => {
  let component: UserResaultComponent;
  let fixture: ComponentFixture<UserResaultComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UserResaultComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UserResaultComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
