import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ListHoroscopoPage } from './list-horoscopo.page';

describe('ListHoroscopoPage', () => {
  let component: ListHoroscopoPage;
  let fixture: ComponentFixture<ListHoroscopoPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ListHoroscopoPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
