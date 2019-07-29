import { TestBed } from '@angular/core/testing';

import { MaquinaVotacionService } from './maquina-votacion.service';

describe('MaquinaVotacionService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MaquinaVotacionService = TestBed.get(MaquinaVotacionService);
    expect(service).toBeTruthy();
  });
});
