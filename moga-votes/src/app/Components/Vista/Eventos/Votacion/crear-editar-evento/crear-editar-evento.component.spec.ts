import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CrearEditarEventoComponent } from './crear-editar-evento.component';

describe('CrearEditarEventoComponent', () => {
  let component: CrearEditarEventoComponent;
  let fixture: ComponentFixture<CrearEditarEventoComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CrearEditarEventoComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CrearEditarEventoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
