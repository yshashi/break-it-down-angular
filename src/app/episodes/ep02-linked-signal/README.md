# Episode 2: `linkedSignal`: the signal that syncs itself

Route: `http://localhost:4200/ep02`

## The idea in one line

A `linkedSignal` is a writable signal that **resets itself whenever its source changes**, and behaves like a normal signal in between.

## Files

| File | What it shows |
|------|---------------|
| `toy-linked-signal.ts` | `createLinkedSignal` built on top of the Episode 1 toy, in about 10 lines |
| `toy-linked-signal.spec.ts` | Derive, override, reset: the whole lifecycle in one test |
| `ep02.page.ts` | Category picker, price filter with `previous`, and pagination |

## Try it

1. **Step 1:** click *Leather Boot* in both panels, then switch to *Shirts*. The left panel keeps a product that is not even in the list. The right one resets.
2. **Step 2:** pick *Canvas Tote* (35 EUR) and drag the slider down to 60. Your pick survives. Pick *Canvas Slip-on* (60 EUR) and drag to 50: it falls back to the first match.
3. **Step 3:** click *Next* five times in both panels (page 6), then type `anna`. Left: "Page 6 of 1" and an empty table. Right: page 1 with results.

## Two forms

```ts
// Short form: reset from a computation
selected = linkedSignal(() => this.productsInCategory()[0]?.id ?? null);

// Long form: explicit source, and access to the previous value
selected = linkedSignal<Product[], number | null>({
  source: this.affordable,
  computation: (list, previous) =>
    previous && list.some(p => p.id === previous.value) ? previous.value : list[0]?.id ?? null,
});
```

## When to use it

Ask one question: **does a person ever need to override this value by hand?**

- No: use `computed()`.
- Yes, but it should snap back when the underlying data changes: use `linkedSignal()`.
- Avoid `effect(() => other.set(...))` for this. It works, but it is one more moving part and easy to get wrong.
