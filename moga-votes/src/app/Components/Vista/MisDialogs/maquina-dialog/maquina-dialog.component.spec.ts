import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MaquinaDialogComponent } from './maquina-dialog.component';

describe('MaquinaDialogComponent', () => {
  let component: MaquinaDialogComponent;
  let fixture: ComponentFixture<MaquinaDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MaquinaDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MaquinaDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
