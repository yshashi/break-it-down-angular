import { Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { debounceTime, distinctUntilChanged, finalize, interval, of, switchMap } from 'rxjs';
import { Product } from '../../shared/data';
import { ProductApi } from '../../shared/product-api';
import { myToObservable, myToSignal } from './toy-interop';

@Component({
  selector: 'app-ep03-page',
  templateUrl: './ep03.page.html',
})
export class Ep03Page {
  private readonly api = inject(ProductApi);

  // ── Step 1: Observable -> Signal ────────────────────────────────────────
  // Our version and Angular's version, fed by the same kind of stream.
  readonly myClock = myToSignal(interval(1000), { initialValue: 0 });
  readonly clock = toSignal(
    interval(1000).pipe(finalize(() => console.log('[ep03] clock unsubscribed: DestroyRef did its job'))),
    { initialValue: 0 },
  );

  // A service that returns an Observable, consumed as a signal. No async pipe, no ngOnDestroy.
  readonly catalog = toSignal(this.api.getAll(), { initialValue: [] as Product[] });

  // ── Step 2: Signal -> Observable ────────────────────────────────────────
  readonly count = signal(0);
  readonly emissions = signal<number[]>([]);
  readonly myEmissions = signal<number[]>([]);

  // ── Step 3: in a real project: debounced search ─────────────────────────
  readonly naiveQuery = signal('');
  readonly naiveKeystrokes = signal(0);
  readonly naiveResults = toSignal(
    toObservable(this.naiveQuery).pipe(
      switchMap((q) => (q ? this.api.search(q, 'naive') : of([]))),
    ),
    { initialValue: [] as Product[] },
  );

  readonly query = signal('');
  readonly keystrokes = signal(0);
  readonly results = toSignal(
    toObservable(this.query).pipe(
      debounceTime(300),
      distinctUntilChanged(),
      switchMap((q) => (q ? this.api.search(q, 'debounced') : of([]))),
    ),
    { initialValue: [] as Product[] },
  );

  readonly naiveStats = computed(() => this.statsFor('naive'));
  readonly debouncedStats = computed(() => this.statsFor('debounced'));
  readonly recentRequests = computed(() =>
    this.api.log().filter((e) => e.channel !== 'catalog').slice(-10).reverse(),
  );

  // ── Step 4: the mistake ─────────────────────────────────────────────────
  readonly mistakeError = signal<string | null>(null);

  constructor() {
    toObservable(this.count)
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.emissions.update((list) => [...list, v]));

    myToObservable(this.count)
      .pipe(takeUntilDestroyed())
      .subscribe((v) => this.myEmissions.update((list) => [...list, v]));
  }

  setThreeTimesSynchronously() {
    this.count.set(this.count() + 1);
    this.count.set(this.count() + 1);
    this.count.set(this.count() + 1);
    // Three writes, but the effect behind toObservable runs once, after they settle.
  }

  onNaiveInput(value: string) {
    this.naiveKeystrokes.update((n) => n + 1);
    this.naiveQuery.set(value);
  }

  onInput(value: string) {
    this.keystrokes.update((n) => n + 1);
    this.query.set(value);
  }

  resetSearch() {
    this.naiveQuery.set('');
    this.query.set('');
    this.naiveKeystrokes.set(0);
    this.keystrokes.set(0);
    this.api.clearLog('naive');
    this.api.clearLog('debounced');
  }

  // Don't do this: toSignal() inside a method runs outside an injection context.
  loadInsideAMethod() {
    try {
      toSignal(this.api.getAll(), { initialValue: [] as Product[] });
      this.mistakeError.set(null);
    } catch (e) {
      this.mistakeError.set((e as Error).message);
    }
  }

  private statsFor(channel: string) {
    const entries = this.api.log().filter((e) => e.channel === channel);
    return {
      sent: entries.length,
      cancelled: entries.filter((e) => e.status === 'cancelled').length,
      completed: entries.filter((e) => e.status === 'done').length,
    };
  }
}
