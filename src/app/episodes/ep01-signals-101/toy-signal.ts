// Episode 1: a signal built from scratch. No Angular in this file.
//
// Three ideas are all it takes:
//   1. a stored value
//   2. a set of consumers that read it
//   3. on write, notify every consumer
//
// Angular's real implementation (in @angular/core/primitives/signals) adds lazy
// computed values, version numbers, glitch-free scheduling and cleanup of stale
// dependencies. The core idea is the same: reads track, writes notify.

type Consumer = () => void;

let activeConsumer: Consumer | null = null;

export type ToyGetter<T> = () => T;
export type ToySetter<T> = (next: T) => void;

export function createSignal<T>(initialValue: T): [ToyGetter<T>, ToySetter<T>] {
  let value = initialValue;
  const consumers = new Set<Consumer>();

  function read(): T {
    // Whoever is running right now is reading us: remember them.
    if (activeConsumer) {
      consumers.add(activeConsumer);
    }
    return value;
  }

  function write(next: T): void {
    // Same value (by reference for objects)? Nobody needs to know.
    // Angular does the same check with Object.is by default.
    if (Object.is(value, next)) {
      return;
    }
    value = next;
    // Copy first so consumers that re-subscribe while running do not loop forever.
    for (const notify of [...consumers]) {
      notify();
    }
  }

  return [read, write];
}

export function createEffect(fn: () => void): void {
  const run: Consumer = () => {
    const previous = activeConsumer; // effects can run inside other effects
    activeConsumer = run;
    try {
      fn();
    } finally {
      activeConsumer = previous;
    }
  };
  run();
}
