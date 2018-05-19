import { TestBed, inject } from '@angular/core/testing';

import { BuildFailLibService } from './build-fail-lib.service';

describe('BuildFailLibService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [BuildFailLibService]
        });
    });

    it(
        'should be created',
        inject([BuildFailLibService], (service: BuildFailLibService) => {
            expect(service).toBeTruthy();
        })
    );
});
