# Episode 3: Signals meet RxJS: `toSignal` and `toObservable`

Route: `http://localhost:4200/ep03`

## The idea in one line

`toSignal` subscribes and calls `.set()` on every emission. `toObservable` is an `effect` that pushes into a `ReplaySubject`. Both clean up through `DestroyRef`.

## Files

| File | What it shows |
|------|---------------|
| `toy-interop.ts` | `myToSignal` and `myToObservable`: working versions in about 20 lines each |
| `ep03.page.ts` | Clock, catalog, emissions, naive vs debounced search, the injection-context mistake |
| `ep03.page.spec.ts` | Proves cleanup on destroy, coalesced emissions, and 7 keystrokes = 1 request |
| `../../shared/product-api.ts` | Fake API with latency, cancellation and a visible request log |

## Try it

1. **Step 1:** both clocks tick together. Open DevTools, go to another episode: `clock unsubscribed` appears in the console.
2. **Step 2:** click *count + 1*, then *set() three times in one click*. The emissions jump from 1 to 4. Three writes, one emission.
3. **Step 3:** type `leather` quickly in both boxes. Left: 7 requests, 6 cancelled. Right: 1 request.
4. **Step 4:** click the red button to see `NG0203`.

## The pattern to copy

```ts
query = signal('');

results = toSignal(
  toObservable(this.query).pipe(
    debounceTime(300),
    distinctUntilChanged(),
    switchMap(q => q ? this.api.search(q) : of([])),
  ),
  { initialValue: [] as Product[] },
);
```

## Rules of thumb

- Always pass `initialValue` (or `requireSync: true` for synchronous sources), or your signal type includes `undefined`.
- Call `toSignal` / `toObservable` once, in a field initializer or the constructor. Not inside a method.
- Need to fetch on demand? Use `resource()` / `httpResource()` (covered in Season 2).
