import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TarotPreguntasPage } from './tarot-preguntas.page';

describe('TarotPreguntasPage', () => {
  let component: TarotPreguntasPage;
  let fixture: ComponentFixture<TarotPreguntasPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TarotPreguntasPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
