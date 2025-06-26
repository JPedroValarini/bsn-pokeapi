import { HttpClient } from '@angular/common/http';
import { Injectable, inject, signal } from '@angular/core';
import { Observable, forkJoin } from 'rxjs';
import { map, mergeMap } from 'rxjs/operators';

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
  private readonly STORAGE_KEY = 'pokemon_favorites';

  favorites = signal<any[]>(this.loadFromStorage());

  constructor(private http: HttpClient) { }

  private loadFromStorage(): any[] {
    const favoritesJson = localStorage.getItem(this.STORAGE_KEY);
    return favoritesJson ? JSON.parse(favoritesJson) : [];
  }

  private saveToStorage(favorites: any[]): void {
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(favorites));
    this.favorites.set(favorites);
  }

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
    const currentFavorites = this.favorites();
    if (!currentFavorites.some(p => p.id === pokemon.id)) {
      const newFavorites = [...currentFavorites, pokemon];
      this.saveToStorage(newFavorites);
    }
  }

  removeFavorite(id: number) {
    const newFavorites = this.favorites().filter(p => p.id !== id);
    this.saveToStorage(newFavorites);
  }

  isFavorite(id: number): boolean {
    return this.favorites().some(p => p.id === id);
  }
}
