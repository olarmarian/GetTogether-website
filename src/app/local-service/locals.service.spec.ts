import { TestBed } from '@angular/core/testing';

import { LocalsService } from './locals.service';

describe('LocalsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LocalsService = TestBed.get(LocalsService);
    expect(service).toBeTruthy();
  });
});
