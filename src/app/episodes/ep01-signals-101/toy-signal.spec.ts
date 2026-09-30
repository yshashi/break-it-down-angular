import { createEffect, createSignal } from './toy-signal';

describe('toy signal (Episode 1)', () => {
  it('re-runs an effect that read it when written', () => {
    const [count, setCount] = createSignal(0);
    const seen: number[] = [];
    createEffect(() => seen.push(count()));

    setCount(1);
    setCount(2);

    expect(seen).toEqual([0, 1, 2]);
  });

  it('does not notify when the value is the same (Object.is)', () => {
    const [count, setCount] = createSignal(5);
    let runs = 0;
    createEffect(() => {
      count();
      runs++;
    });

    setCount(5);

    expect(runs).toBe(1);
  });

  it('does not notify when an array is mutated and set with the same reference', () => {
    const [items, setItems] = createSignal<string[]>([]);
    const lengths: number[] = [];
    createEffect(() => lengths.push(items().length));

    const list = items();
    list.push('lost');
    setItems(list);
    setItems([...list, 'found']);

    expect(lengths).toEqual([0, 2]);
  });

  it('only tracks signals that were actually read', () => {
    const [a, setA] = createSignal('a');
    const [, setB] = createSignal('b');
    let runs = 0;
    createEffect(() => {
      a();
      runs++;
    });

    setB('changed');
    expect(runs).toBe(1);
    setA('changed');
    expect(runs).toBe(2);
  });
});
