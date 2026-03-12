import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarotHoroscopoPage } from './tarot-horoscopo.page';

describe('TarotHoroscopoPage', () => {
  let component: TarotHoroscopoPage;
  let fixture: ComponentFixture<TarotHoroscopoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarotHoroscopoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
