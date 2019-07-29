import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EmitirVotacionComponent } from './emitir-votacion.component';

describe('EmitirVotacionComponent', () => {
  let component: EmitirVotacionComponent;
  let fixture: ComponentFixture<EmitirVotacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EmitirVotacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EmitirVotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
