import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorCandidateListComponent } from './vendor-candidate-list.component';

describe('VendorCandidateListComponent', () => {
  let component: VendorCandidateListComponent;
  let fixture: ComponentFixture<VendorCandidateListComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorCandidateListComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorCandidateListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
