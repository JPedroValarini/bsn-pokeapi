import { HttpClient } from '@angular/common/http';
import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class PokemonService {
  private apiUrl = 'https://pokeapi.co/api/v2/pokemon';
  favorites = signal<any[]>([]);

  constructor(private http: HttpClient) { }

  getPokemons(offset: number, limit: number): Observable<any> {
    return this.http.get(`${this.apiUrl}?offset=${offset}&limit=${limit}`);
  }

  getPokemonDetails(id: string): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  getPokemonSpecies(id: string): Observable<any> {
    return this.http.get(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
  }

  addFavorite(pokemon: any) {
    this.favorites.update(favs => [...favs, pokemon]);
  }

  removeFavorite(id: number) {
    this.favorites.update(favs => favs.filter(p => p.id !== id));
  }
}
