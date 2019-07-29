import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModoPresentacionComponent } from './modo-presentacion.component';

describe('ModoPresentacionComponent', () => {
  let component: ModoPresentacionComponent;
  let fixture: ComponentFixture<ModoPresentacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModoPresentacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModoPresentacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
