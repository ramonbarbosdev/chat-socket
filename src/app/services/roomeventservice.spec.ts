import { TestBed } from '@angular/core/testing';

import { Roomeventservice } from './eventservice';

describe('Roomeventservice', () => {
  let service: Roomeventservice;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(Roomeventservice);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
