import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ResultadosChatgptPage } from './resultados-chatgpt.page';

describe('ResultadosChatgptPage', () => {
  let component: ResultadosChatgptPage;
  let fixture: ComponentFixture<ResultadosChatgptPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ResultadosChatgptPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
