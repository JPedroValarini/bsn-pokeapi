import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader, IonToolbar, IonTitle, IonContent, IonCard, IonCardHeader,
  IonCardTitle, IonCardSubtitle, IonSpinner, IonText, IonButton,
  IonFooter, IonButtons, IonIcon
} from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon.service';
import { RouterModule } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline, chevronForwardOutline } from 'ionicons/icons';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader, IonToolbar, IonTitle, IonContent,
    IonCard, IonCardHeader, IonCardTitle, IonCardSubtitle,
    IonSpinner, IonText, IonButton, IonFooter, IonButtons, IonIcon
  ]
})
export class HomePage {
  private readonly pokemonService = inject(PokemonService);

  pokemons: any[] = [];
  offset = 0;
  limit = 20;
  isLoading = false;
  error: any = null;
  hasMore = true;
  currentPage = 1;
  totalPages = 1;

  constructor() {
    addIcons({ chevronBackOutline, chevronForwardOutline });
    this.loadPokemons();
  }

  loadPokemons() {
    if (this.isLoading) return;

    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemons(this.offset, this.limit).subscribe({
      next: (pokemonsWithColors: any[]) => {
        console.log('Pokémons recebidos:', pokemonsWithColors);
        this.pokemons = pokemonsWithColors;
        this.hasMore = this.offset + this.limit < 1000;
        this.calculateTotalPages(1000);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar pokémons:', err);
        this.error = err;
        this.isLoading = false;
      }
    });
  }

  calculateTotalPages(totalItems: number) {
    this.totalPages = Math.ceil(totalItems / this.limit);
  }

  nextPage() {
    if (!this.hasMore) return;

    this.offset += this.limit;
    this.currentPage++;
    this.loadPokemons();
  }

  previousPage() {
    if (this.offset === 0) return;

    this.offset -= this.limit;
    this.currentPage--;
    this.loadPokemons();
  }

  getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2] || '0';
  }

  reload() {
    this.offset = 0;
    this.currentPage = 1;
    this.pokemons = [];
    this.hasMore = true;
    this.loadPokemons();
  }

  getCardStyle(color: string) {
  const colorMap: { [key: string]: string } = {
    black: '#000000',
    blue: '#429BED',
    brown: '#B1736C',
    gray: '#A0A29F',
    green: '#48D0B0',
    pink: '#FB5584',
    purple: '#9F5BBA',
    red: '#FA6555',
    white: '#F9F9F9',
    yellow: '#FFCE4B'
  };

  const borderColor = colorMap[color] || '#A0A29F';

  return {
    border: `3px solid ${borderColor}`,
    backgroundColor: '#ffffff',
    color: '#000000'
  };
}

}
