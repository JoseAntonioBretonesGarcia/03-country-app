import { Component } from '@angular/core';
import { Country } from '../../interfaces/country.interface';
import { CountriesService } from '../../services/countries.service';

@Component({
  selector: 'app-by-country-page',
  templateUrl: './by-country-page.component.html',
  styles: [],
})
export class ByCountryPageComponent {
  public placeholder: string = 'Buscar por país...';

  public countries: Country[] = [];

  constructor(private countriesService: CountriesService) {}

  searchByCountryName(term: string): void {
    this.countriesService
      .getCountriesByName(term)
      .subscribe((res) => (this.countries = res));
  }
}
