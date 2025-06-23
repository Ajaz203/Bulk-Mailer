import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SingleUploadComponent } from './single-upload.component';

describe('SingleUploadComponent', () => {
  let component: SingleUploadComponent;
  let fixture: ComponentFixture<SingleUploadComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SingleUploadComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SingleUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
