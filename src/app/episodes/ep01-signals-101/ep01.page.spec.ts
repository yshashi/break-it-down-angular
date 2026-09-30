import { TestBed } from '@angular/core/testing';
import { Ep01Page } from './ep01.page';

describe('Ep01Page', () => {
  async function setup() {
    TestBed.configureTestingModule({ imports: [Ep01Page] });
    const fixture = TestBed.createComponent(Ep01Page);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const text = (id: string) => el.querySelector(`[data-testid="${id}"]`)?.textContent?.trim() ?? '';
    const click = async (label: string) => {
      const button = [...el.querySelectorAll('button')].find((b) => b.textContent?.trim() === label);
      if (!button) throw new Error(`No button "${label}"`);
      button.click();
      await fixture.whenStable();
    };
    return { fixture, el, text, click };
  }

  it('derives doubled from count', async () => {
    const { text, click } = await setup();
    await click('count.set(5)');
    expect(text('count')).toBe('5');
    expect(text('doubled')).toBe('10');
  });

  it('filters products as the query changes', async () => {
    const { fixture, text } = await setup();
    fixture.componentInstance.query.set('boot');
    await fixture.whenStable();
    expect(text('result-count')).toBe('2 of 18 products');
  });

  it('shows the mutation bug: push is invisible until an immutable update', async () => {
    const { el, text, click } = await setup();
    const items = () => el.querySelectorAll('[data-testid="todo-list"] li').length;

    await click('todos().push(...)');
    await click('push, then todos.set(sameArray)');
    expect(items()).toBe(1);
    expect(text('todo-count')).toBe('todoCount() = 1');

    await click('todos.update(l => [...l, item])');
    expect(items()).toBe(4);
    expect(text('todo-count')).toBe('todoCount() = 4');
  });
});
