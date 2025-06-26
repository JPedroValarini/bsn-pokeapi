import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { IonicModule, ToastController } from '@ionic/angular';
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
  private toastController = inject(ToastController);

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
    this.isFavorite = favorites.some((fav: { id: any; }) => fav.id === this.pokemon.id);
  }

  toggleFavorite() {
    if (this.isFavorite) {
      this.pokemonService.removeFavorite(this.pokemon.id);
      this.showToast(`${this.pokemon.name} removido dos favoritos`);
    } else {
      this.pokemonService.addFavorite(this.pokemon);
      this.showToast(`${this.pokemon.name} adicionado aos favoritos`);
    }
    this.isFavorite = !this.isFavorite;
  }

  async showToast(message: string) {
    const toast = await this.toastController.create({
      message,
      duration: 1500,
      position: 'bottom',
      color: 'primary'
    });
    toast.present();
  }

  getStatPercentage(statValue: number): number {
    return (statValue / 255) * 100;
  }
}
