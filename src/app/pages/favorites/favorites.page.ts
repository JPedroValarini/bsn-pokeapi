import { Component } from '@angular/core';
import { PokemonService } from '../../services/pokemon.service';
import { CommonModule } from '@angular/common';
import { IonicModule } from '@ionic/angular';
import { Router } from '@angular/router';
import { addIcons } from 'ionicons';
import { chevronBackOutline, heartDislikeOutline } from 'ionicons/icons';

@Component({
  selector: 'app-favorites',
  templateUrl: './favorites.page.html',
  styleUrls: ['./favorites.page.scss'],
  standalone: true,
  imports: [CommonModule, IonicModule]
})
export class FavoritesPage {
  constructor(
    public pokemonService: PokemonService,
    private router: Router
  ) {
    addIcons({ chevronBackOutline, heartDislikeOutline });
  }

  getPokemonImage(id: string) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
  }

  openDetails(pokemonId: string) {
    this.router.navigate(['/details', pokemonId]);
  }

  goBack() {
    this.router.navigate(['/']);
  }
}
