# Episode 1: Signals 101: `signal`, `computed`, `effect`

Route: `http://localhost:4200/ep01`

## The idea in one line

A signal is a stored value, a set of readers, and a notify step on write. **Reads track. Writes notify.**

## Files

| File | What it shows |
|------|---------------|
| `toy-signal.ts` | `createSignal` and `createEffect` in ~40 lines of plain TypeScript |
| `toy-signal.spec.ts` | Tests that prove the toy tracks reads, skips same-value writes, and misses mutations |
| `ep01.page.ts` | The real API, a product search, and the mutation bug |
| `todo-list.ts` | A child component that only re-renders when its input gets a new reference |

## Try it

1. **Step 1:** click *toy count + 1* twice, then *write the same value*. Three log lines, not four.
2. **Step 2:** click *count.set(5)*, then *count.update*, then *count.set(count())*. The effect log skips the last one.
3. **Step 3:** type `boot` in the search box. `filtered` is a `computed`, so it re-runs only when `query` or `products` change.
4. **Step 4:** click both red buttons. Nothing changes. Click the green one: all the "lost" items appear at once.

## Key takeaways

- `signal()` gives you a getter plus `.set()` and `.update()`.
- `computed()` is read-only, lazy and cached.
- `effect()` is for side effects (logging, storage, non-Angular widgets), not for deriving state.
- Signals compare with `Object.is`. Mutating an array and setting the same reference notifies nobody. Always create a new value: `list.update(l => [...l, item])`.
