import { TestBed, inject } from '@angular/core/testing';

import { LibBService } from './lib-b.service';

describe('LibBService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [LibBService]
        });
    });

    it(
        'should be created',
        inject([LibBService], (service: LibBService) => {
            expect(service).toBeTruthy();
        })
    );
});
