import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { ActivatedRoute } from '@angular/router';
import { PokemonService } from '../../services/pokemon.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-details',
  templateUrl: './details.page.html',
  styleUrls: ['./details.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class DetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private pokemonService = inject(PokemonService);

  pokemon: any = null;
  isLoading = true;
  error = null;
  isFavorite = false;

  ngOnInit() {
    const pokemonId = this.route.snapshot.paramMap.get('id');

    if (pokemonId) {
      this.loadPokemonDetails(pokemonId);
    }
  }

  loadPokemonDetails(id: string) {
    this.isLoading = true;

    forkJoin([
      this.pokemonService.getPokemonDetails(id),
      this.pokemonService.getPokemonSpecies(id)
    ]).subscribe({
      next: ([details, species]) => {
        this.pokemon = {
          ...details,
          species: species
        };
        this.checkIfFavorite();
        this.isLoading = false;
      },
      error: (err) => {
        this.error = err;
        this.isLoading = false;
      }
    });
  }

  checkIfFavorite() {
    const favorites = this.pokemonService.favorites();
    this.isFavorite = favorites.some(fav => fav.id === this.pokemon.id);
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.pokemonService.removeFavorite(this.pokemon.id);
    } else {
      this.pokemonService.addFavorite(this.pokemon);
    }
    this.isFavorite = !this.isFavorite;
  }

  getStatPercentage(statValue: number): number {
    return (statValue / 255) * 100;
  }
}
