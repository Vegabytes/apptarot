import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { ICard } from '../interfaces/card.interface';
import { ResponseCard, ResponseYesOrNot } from '../interfaces/responsegpt.interface';
@Injectable({
  providedIn: 'root'
})
export class CardService {

  constructor(private http: HttpClient) { }

  getCardsGame(): Observable<ICard[]> {
    return this.http.get<ICard[]>(`${environment.apiUrl}/cards-game`);
  }

  getCardsYesOrNo(): Observable<ICard[]> {
    return this.http.get<ICard[]>(`${environment.apiUrl}/cards-yes-or-no`);
  }

  responseYesOrNo(card: ICard): Observable<ResponseYesOrNot> {
    let ids = [card.id]
    return this.http.post<ResponseYesOrNot>(`${environment.apiUrl}/cards-yes-or-no-result`, {"ids": ids});
  }

  responseGame(subject: string, cards: ICard[]): Observable<ResponseCard> {
    let ids: number[] = cards.map((ele)=>ele.id)
    return this.http.post<ResponseCard>(`${environment.apiUrl}/cards-game-result/${subject}`, {"ids": ids});
  }
}
