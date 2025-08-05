import { ComponentFixture, TestBed } from '@angular/core/testing';

import { HomeTilesComponent } from './home-tiles.component';

describe('HomeTilesComponent', () => {
  let component: HomeTilesComponent;
  let fixture: ComponentFixture<HomeTilesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [HomeTilesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(HomeTilesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
