import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-home-page',
  imports: [RouterLink],
  template: `
    <header class="page-header">
      <p class="eyebrow">Season 1 · Signals Foundations</p>
      <h1>Break It Down: Angular</h1>
      <p class="lead">One idea per episode. First how it works inside, then how you use it in a real project.</p>
    </header>
    <ol class="episode-list">
      @for (ep of episodes; track ep.path) {
        <li>
          <a [routerLink]="ep.path">
            <span class="ep-no">{{ ep.no }}</span>
            <span>
              <strong>{{ ep.title }}</strong>
              <small>{{ ep.summary }}</small>
            </span>
          </a>
        </li>
      }
    </ol>
  `,
})
export class HomePage {
  readonly episodes = [
    { no: '01', path: '/ep01', title: 'Signals 101: signal, computed, effect', summary: 'Build a signal from scratch, then map it onto the real API.' },
    { no: '02', path: '/ep02', title: 'linkedSignal: the signal that syncs itself', summary: 'Derived state with a manual override. Fixes the page-7-of-1 bug.' },
    { no: '03', path: '/ep03', title: 'Signals meet RxJS: toSignal and toObservable', summary: 'Bridge both worlds without a single manual subscribe.' },
  ];
}
