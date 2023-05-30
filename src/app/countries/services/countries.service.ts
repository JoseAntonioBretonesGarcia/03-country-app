import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { Observable, catchError, map, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1/';
  private capital: string = 'capital';
  private name: string = 'name';
  private region: string = 'region';

  constructor(private http: HttpClient) {}

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl.concat('alpha')}/${code}`;
    return this.http.get<Country[]>(url).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)),
      catchError(() => of(null))
    );
  }

  getCountriesByCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl.concat(this.capital)}/${term}`;
    return this.http.get<Country[]>(url).pipe(catchError(() => of([])));
  }

  getCountriesByName(term: string): Observable<Country[]> {
    const url = `${this.apiUrl.concat(this.name)}/${term}`;
    return this.http.get<Country[]>(url).pipe(catchError(() => of([])));
  }

  getCountriesByRegion(term: string): Observable<Country[]> {
    const url = `${this.apiUrl.concat(this.region)}/${term}`;
    return this.http.get<Country[]>(url).pipe(catchError(() => of([])));
  }
}
