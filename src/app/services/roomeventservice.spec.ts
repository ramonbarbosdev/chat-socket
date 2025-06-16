import { TestBed } from '@angular/core/testing';

import { Roomeventservice } from './roomeventservice';

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
