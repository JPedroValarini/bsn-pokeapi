import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonContent,
  IonList,
  IonItem,
  IonAvatar,
  IonLabel,
  IonInfiniteScroll,
  IonInfiniteScrollContent,
  IonSpinner,
  IonText,
  IonButton,
  type InfiniteScrollCustomEvent
} from '@ionic/angular/standalone';
import { PokemonService } from '../../services/pokemon.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-home',
  templateUrl: './home.page.html',
  styleUrls: ['./home.page.scss'],
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    IonHeader,
    IonToolbar,
    IonTitle,
    IonContent,
    IonList,
    IonItem,
    IonAvatar,
    IonLabel,
    IonInfiniteScroll,
    IonInfiniteScrollContent,
    IonSpinner,
    IonText,
    IonButton
  ]
})
export class HomePage {
  private readonly pokemonService = inject(PokemonService);

  pokemons: any[] = [];
  offset = 0;
  isLoading = false;
  error: any = null;
  hasMore = true;

  constructor() {
    this.loadPokemons();
  }

  loadPokemons() {
    if (this.isLoading || !this.hasMore) return;

    this.isLoading = true;
    this.error = null;

    this.pokemonService.getPokemons(this.offset).subscribe({
      next: (response: any) => {
        this.pokemons = [...this.pokemons, ...response.results];
        this.hasMore = !!response.next;
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
      }
    });
  }

  loadMore(event: Event) {
    const infiniteScrollEvent = event as InfiniteScrollCustomEvent;
    const infiniteScroll = infiniteScrollEvent.target;

    if (!this.hasMore) {
      infiniteScroll.complete();
      infiniteScroll.disabled = true;
      return;
    }

    this.offset += 20;
    this.loadPokemons();

    setTimeout(() => {
      infiniteScroll.complete();

      if (!this.hasMore) {
        infiniteScroll.disabled = true;
      }
    }, 500);
  }

  getPokemonId(url: string): string {
    const parts = url.split('/');
    return parts[parts.length - 2] || '0';
  }

  reload() {
    this.offset = 0;
    this.pokemons = [];
    this.hasMore = true;
    this.loadPokemons();
  }
}
