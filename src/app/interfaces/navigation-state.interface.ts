import { ICard } from './card.interface';
import { Horoscope } from './horoscope.interface';

/** State passed to /resultados-chatgpt */
export interface ResultadosChatgptState {
  card: ICard;
}

/** State passed to /resultados */
export interface ResultadosState {
  subject: string;
  cards:   ICard[];
}

/** State passed to /tarot-horoscopo */
export interface TarotHoroscopoState {
  horoscope:     Horoscope | undefined;
  formattedDate: string;
}

/** State passed to /tarot-diario-detalle */
export interface TarotDiarioDetalleState {
  subject: string;
}
