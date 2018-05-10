import { TestBed, inject } from '@angular/core/testing';

import { LibAService } from './lib-a.service';

describe('LibAService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LibAService]
        });
    });

    it(
        'should be created',
        inject([LibAService], (service: LibAService) => {
            expect(service).toBeTruthy();
        })
    );
});
