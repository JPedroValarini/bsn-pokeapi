import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap, tap } from 'rxjs/operators';

interface PokemonResponse {
  name: string;
  url: string;
}

interface PokemonWithColor {
  id: string;
  name: string;
  speciesColor: string;
  [key: string]: any;
}

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  private speciesUrl = 'https://pokeapi.co/api/v2/pokemon-species';
  favorites = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  getPokemons(offset: number, limit: number): Observable<PokemonWithColor[]> {
    return this.http.get<{ results: PokemonResponse[] }>(`${this.apiUrl}?offset=${offset}&limit=${limit}`).pipe(
      mergeMap(response => {
        const requests: Observable<PokemonWithColor>[] = response.results.map(pokemon => {
          const id = this.getPokemonId(pokemon.url);
          return this.getPokemonWithColor(id);
        });
        return forkJoin<PokemonWithColor[]>(requests);
      })
    );
  }

  private getPokemonWithColor(id: string): Observable<any> {
    return forkJoin([
      this.http.get<any>(`${this.apiUrl}/${id}`),
      this.http.get<any>(`${this.speciesUrl}/${id}`)
    ]).pipe(
      tap(([details, species]) => {
        console.log('Species data:', species);
      }),
      map(([details, species]) => ({
        ...details,
        speciesColor: species.color?.name || 'gray',
        id: details.id || id
      }))
    );
  }

  getPokemonDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getPokemonSpecies(id: string): Observable<any> {
    return this.http.get(`${this.speciesUrl}/${id}`);
  }

  private getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2] || '0';
  }

  addFavorite(pokemon: any) {
    this.favorites.update((favs: any) => [...favs, pokemon]);
  }

  removeFavorite(id: number) {
    this.favorites.update((favs: any[]) => favs.filter(p => p.id !== id));
  }
}
