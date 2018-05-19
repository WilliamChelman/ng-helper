import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BuildFailLibComponent } from './build-fail-lib.component';

describe('BuildFailLibComponent', () => {
    let component: BuildFailLibComponent;
    let fixture: ComponentFixture<BuildFailLibComponent>;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            declarations: [BuildFailLibComponent]
        }).compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(BuildFailLibComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });
});
