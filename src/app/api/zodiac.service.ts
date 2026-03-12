import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Zodiac } from '../interfaces/zodiac.interface';
import { Horoscope } from '../interfaces/horoscope.interface';

@Injectable({
  providedIn: 'root'
})
export class ZodiacService {

  constructor(private http: HttpClient) { }

  getZodiacSigns(): Observable<Zodiac[]> {
    return this.http.get<Zodiac[]>(`${environment.apiUrl}/zodiac-sign`);
  }

  getHoroscopeAll(): Observable<Horoscope[]> {
    return this.http.get<Horoscope[]>(`${environment.apiUrl}/horoscope-all`);
  }

}
