import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <nav class="topbar">
      <a routerLink="/" class="brand">Break It Down<span>.ng</span></a>
      <a routerLink="/ep01" routerLinkActive="active">01 Signals</a>
      <a routerLink="/ep02" routerLinkActive="active">02 linkedSignal</a>
      <a routerLink="/ep03" routerLinkActive="active">03 RxJS interop</a>
    </nav>
    <main>
      <router-outlet />
    </main>
  `,
})
export class App {}
