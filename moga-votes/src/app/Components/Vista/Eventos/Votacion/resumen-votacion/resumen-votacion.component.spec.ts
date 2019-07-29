import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ResumenVotacionComponent } from './resumen-votacion.component';

describe('ResumenVotacionComponent', () => {
  let component: ResumenVotacionComponent;
  let fixture: ComponentFixture<ResumenVotacionComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ResumenVotacionComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ResumenVotacionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
