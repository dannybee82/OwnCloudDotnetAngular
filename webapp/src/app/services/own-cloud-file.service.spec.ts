import { TestBed } from '@angular/core/testing';

import { OwnCloudFileService } from './own-cloud-file.service';

describe('OwnCloudFileService', () => {
  let service: OwnCloudFileService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(OwnCloudFileService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});