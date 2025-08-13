import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SavedUPIComponent } from './saved-upi.component';

describe('SavedUPIComponent', () => {
  let component: SavedUPIComponent;
  let fixture: ComponentFixture<SavedUPIComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SavedUPIComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SavedUPIComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
