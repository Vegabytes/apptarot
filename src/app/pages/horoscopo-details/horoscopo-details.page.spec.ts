import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HoroscopoDetailsPage } from './horoscopo-details.page';

describe('HoroscopoDetailsPage', () => {
  let component: HoroscopoDetailsPage;
  let fixture: ComponentFixture<HoroscopoDetailsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(HoroscopoDetailsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
