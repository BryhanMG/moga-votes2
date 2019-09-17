import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ConexionRedBcDialogComponent } from './conexion-red-bc-dialog.component';

describe('ConexionRedBcDialogComponent', () => {
  let component: ConexionRedBcDialogComponent;
  let fixture: ComponentFixture<ConexionRedBcDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ConexionRedBcDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ConexionRedBcDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
