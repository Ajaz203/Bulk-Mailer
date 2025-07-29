import { TestBed } from '@angular/core/testing';

import {BulkEmailService} from './bulk-email.service';

describe('BulkEmailService', () => {
  let service: BulkEmailService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BulkEmailService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
