import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { shareReplay, tap } from 'rxjs/operators';
import { Zodiac } from '../interfaces/zodiac.interface';
import { Horoscope } from '../interfaces/horoscope.interface';

@Injectable({
  providedIn: 'root'
})
export class ZodiacService {

  private zodiacSigns$: Observable<Zodiac[]> | null = null;
  private horoscopeCache: { data: Horoscope[]; timestamp: number } | null = null;
  private readonly HOROSCOPE_TTL = 60 * 60 * 1000;

  constructor(private http: HttpClient) { }

  getZodiacSigns(): Observable<Zodiac[]> {
    if (!this.zodiacSigns$) {
      this.zodiacSigns$ = this.http.get<Zodiac[]>(`${environment.apiUrl}/zodiac-sign`).pipe(
        shareReplay(1)
      );
    }
    return this.zodiacSigns$;
  }

  getHoroscopeAll(): Observable<Horoscope[]> {
    const now = Date.now();
    if (this.horoscopeCache && (now - this.horoscopeCache.timestamp) < this.HOROSCOPE_TTL) {
      return new Observable<Horoscope[]>(subscriber => {
        subscriber.next(this.horoscopeCache!.data);
        subscriber.complete();
      });
    }
    return this.http.get<Horoscope[]>(`${environment.apiUrl}/horoscope-all`).pipe(
      tap(data => {
        this.horoscopeCache = { data, timestamp: Date.now() };
      })
    );
  }

}
