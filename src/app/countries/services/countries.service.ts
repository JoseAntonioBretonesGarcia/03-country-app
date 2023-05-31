import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Country } from '../interfaces/country.interface';
import { Observable, catchError, tap, map, of } from 'rxjs';
import { CacheStore } from '../interfaces/cache-store.interface';
import { Region } from '../interfaces/region.type';

@Injectable({
  providedIn: 'root',
})
export class CountriesService {
  private apiUrl: string = 'https://restcountries.com/v3.1/';
  private capital: string = 'capital';
  private name: string = 'name';
  private region: string = 'region';

  public cacheStore: CacheStore = {
    byCapital: { term: '', countries: [] },
    byCountry: { term: '', countries: [] },
    byRegion: { region: '', countries: [] },
  };

  constructor(private http: HttpClient) {
    console.log('CountriesService init');
    this.loadToLocalStorage();
  }

  private saveToLocalStorage(): void {
    localStorage.setItem('cacheStore', JSON.stringify(this.cacheStore));
  }

  private loadToLocalStorage(): void {
    if (!localStorage.getItem('cacheStore')) return;
    this.cacheStore = JSON.parse(localStorage.getItem('cacheStore'));
  }

  private getCountriesRequest(url: string): Observable<Country[]> {
    return this.http.get<Country[]>(url).pipe(catchError(() => of([])));
  }

  searchCountryByAlphaCode(code: string): Observable<Country | null> {
    const url = `${this.apiUrl.concat('alpha')}/${code}`;
    return this.http.get<Country[]>(url).pipe(
      map((countries) => (countries.length > 0 ? countries[0] : null)),
      catchError(() => of(null))
    );
  }

  getCountriesByCapital(term: string): Observable<Country[]> {
    const url = `${this.apiUrl.concat(this.capital)}/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => (this.cacheStore.byCapital = { term, countries })),
      tap(() => this.saveToLocalStorage())
    );
  }

  getCountriesByCountry(term: string): Observable<Country[]> {
    const url = `${this.apiUrl.concat(this.name)}/${term}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => (this.cacheStore.byCountry = { term, countries })),
      tap(() => this.saveToLocalStorage())
    );
  }

  getCountriesByRegion(region: Region): Observable<Country[]> {
    const url = `${this.apiUrl.concat(this.region)}/${region}`;
    return this.getCountriesRequest(url).pipe(
      tap((countries) => (this.cacheStore.byRegion = { region, countries })),
      tap(() => this.saveToLocalStorage())
    );
  }
}
