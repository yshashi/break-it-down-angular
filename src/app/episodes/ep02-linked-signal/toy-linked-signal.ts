// Episode 2: linkedSignal built from scratch on top of the Episode 1 toy.
//
// A linkedSignal is a WRITABLE signal with one extra rule:
//   whenever its source changes, reset the value from the computation.
// Between resets, it is just a normal signal you can set by hand.
//
// Angular's real linkedSignal is lazy (it only recomputes when read) and
// hands you the previous value. This eager version shows the idea in 10 lines.

import { ToyGetter, ToySetter, createEffect, createSignal } from '../ep01-signals-101/toy-signal';

export function createLinkedSignal<S, D>(
  source: ToyGetter<S>,
  computation: (source: S) => D,
): [ToyGetter<D>, ToySetter<D>] {
  const [read, write] = createSignal<D>(computation(source()));

  // Re-runs every time `source` changes, and resets the value.
  createEffect(() => {
    write(computation(source()));
  });

  // Manual writes go straight through and stick until the source moves again.
  return [read, write];
}
