import { TestBed } from '@angular/core/testing';

import { BasededadosService } from './basededados.service';

describe('BasededadosService', () => {
  let service: BasededadosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BasededadosService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
