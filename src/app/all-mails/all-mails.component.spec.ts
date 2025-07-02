import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AllMailsComponent } from './all-mails.component';

describe('AllMailsComponent', () => {
  let component: AllMailsComponent;
  let fixture: ComponentFixture<AllMailsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AllMailsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AllMailsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
