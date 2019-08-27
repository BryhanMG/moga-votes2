import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EliminarImagenDialogComponent } from './eliminar-imagen-dialog.component';

describe('EliminarImagenDialogComponent', () => {
  let component: EliminarImagenDialogComponent;
  let fixture: ComponentFixture<EliminarImagenDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EliminarImagenDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EliminarImagenDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
