import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VendorSingleUploadComponent } from './vendor-single-upload.component';

describe('VendorSingleUploadComponent', () => {
  let component: VendorSingleUploadComponent;
  let fixture: ComponentFixture<VendorSingleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [VendorSingleUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(VendorSingleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
