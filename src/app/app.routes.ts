import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '',
    loadComponent: () => import('./pages/home/home.page').then(m => m.HomePage)
  },
  {
    path: 'details/:id',
    loadComponent: () => import('./pages/details/details.page').then(m => m.DetailsPage)
  },
  {
    path: 'favorites',
    loadComponent: () => import('./pages/favorites/favorites.page').then((m) => m.FavoritesPage),
  },
];
