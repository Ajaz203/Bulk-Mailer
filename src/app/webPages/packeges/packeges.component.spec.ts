import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackegesComponent } from './packeges.component';

describe('PackegesComponent', () => {
  let component: PackegesComponent;
  let fixture: ComponentFixture<PackegesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PackegesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PackegesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
