import { Routes } from '@angular/router';
import { HomePage } from './home.page';

export const routes: Routes = [
  { path: '', component: HomePage, title: 'Break It Down: Angular' },
  {
    path: 'ep01',
    loadComponent: () => import('./episodes/ep01-signals-101/ep01.page').then((m) => m.Ep01Page),
    title: 'Ep 1 · Signals 101',
  },
  {
    path: 'ep02',
    loadComponent: () => import('./episodes/ep02-linked-signal/ep02.page').then((m) => m.Ep02Page),
    title: 'Ep 2 · linkedSignal',
  },
  {
    path: 'ep03',
    loadComponent: () => import('./episodes/ep03-rxjs-interop/ep03.page').then((m) => m.Ep03Page),
    title: 'Ep 3 · toSignal and toObservable',
  },
  { path: '**', redirectTo: '' },
];
