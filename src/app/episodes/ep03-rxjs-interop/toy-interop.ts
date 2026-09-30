// Episode 3: toSignal and toObservable, stripped down to what they really do.
// Both are real, working functions you can drop into a component.
// Angular's versions add error handling, `requireSync`, `manualCleanup`,
// equality options and an `injector` option for use outside constructors.

import { DestroyRef, Signal, assertInInjectionContext, effect, inject, signal } from '@angular/core';
import { Observable, ReplaySubject } from 'rxjs';

/** Observable -> Signal: subscribe, and call .set() on every emission. */
export function myToSignal<T>(source$: Observable<T>, options: { initialValue: T }): Signal<T> {
  // Same guard Angular uses: we need a DestroyRef, so we need an injection context.
  assertInInjectionContext(myToSignal);

  const state = signal(options.initialValue);
  const subscription = source$.subscribe((value) => state.set(value));

  // Unsubscribe automatically when the component (or service) is destroyed.
  inject(DestroyRef).onDestroy(() => subscription.unsubscribe());

  return state.asReadonly();
}

/** Signal -> Observable: an effect that pushes into a ReplaySubject. */
export function myToObservable<T>(source: Signal<T>): Observable<T> {
  assertInInjectionContext(myToObservable);

  const subject = new ReplaySubject<T>(1); // late subscribers still get the latest value

  const watcher = effect(() => {
    subject.next(source()); // re-runs whenever `source` changes
  });

  inject(DestroyRef).onDestroy(() => {
    watcher.destroy();
    subject.complete();
  });

  return subject.asObservable();
}
