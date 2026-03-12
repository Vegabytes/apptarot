export interface Horoscope {
  id:               number;
  zodiacsign:       Sign;
  color:            Color;
  colorhexa:        string;
  colorname:        string;
  numberhoroscope:  number;
  description:      string;
  datehoroscope:    string;
  compatible_signs: Sign[];
}

export interface Color {
  id:    number;
  name:  string;
  color: string;
}

export interface Sign {
  id:    number;
  name:  string;
  orden: number;
  image: string;
}
