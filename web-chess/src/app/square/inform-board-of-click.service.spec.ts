import { TestBed } from '@angular/core/testing';

import { InformBoardOfClickService } from './inform-board-of-click.service';

describe('InformBoardOfClickService', () => {
  let service: InformBoardOfClickService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformBoardOfClickService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
