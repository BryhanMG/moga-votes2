import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ValidarVotanteComponent } from './validar-votante.component';

describe('ValidarVotanteComponent', () => {
  let component: ValidarVotanteComponent;
  let fixture: ComponentFixture<ValidarVotanteComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ValidarVotanteComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ValidarVotanteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
