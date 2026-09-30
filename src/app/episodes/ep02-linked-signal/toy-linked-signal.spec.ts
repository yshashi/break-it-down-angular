import { createSignal } from '../ep01-signals-101/toy-signal';
import { createLinkedSignal } from './toy-linked-signal';

describe('toy linkedSignal (Episode 2)', () => {
  it('derives from the source, accepts manual writes, and resets when the source changes', () => {
    const [category, setCategory] = createSignal('shoes');
    const [selected, setSelected] = createLinkedSignal(category, (c) => `first ${c}`);

    expect(selected()).toBe('first shoes');

    setSelected('hand-picked boot');
    expect(selected()).toBe('hand-picked boot');

    setCategory('shirts');
    expect(selected()).toBe('first shirts');
  });
});
