import { TestBed } from '@angular/core/testing';

import { Baseservice } from './baseservice';

describe('Baseservice', () => {
  let service: Baseservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Baseservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
