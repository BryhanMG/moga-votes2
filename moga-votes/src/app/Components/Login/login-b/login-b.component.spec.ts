import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LoginBComponent } from './login-b.component';

describe('LoginBComponent', () => {
  let component: LoginBComponent;
  let fixture: ComponentFixture<LoginBComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LoginBComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LoginBComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
