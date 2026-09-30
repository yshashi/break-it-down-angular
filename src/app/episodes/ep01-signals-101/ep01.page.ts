import { Component, computed, effect, signal } from '@angular/core';
import { PRODUCTS, Product } from '../../shared/data';
import { createEffect, createSignal } from './toy-signal';
import { TodoList } from './todo-list';

@Component({
  selector: 'app-ep01-page',
  imports: [TodoList],
  templateUrl: './ep01.page.html',
})
export class Ep01Page {
  // ── Step 1: our from-scratch signal ─────────────────────────────────────
  // The toy lives outside Angular, so we mirror its effect output into an
  // Angular signal (toyLog) purely so the page can display it.
  readonly toyLog = signal<string[]>([]);
  private readonly toyCount = createSignal(0);

  // ── Step 2: the real API ────────────────────────────────────────────────
  readonly count = signal(0);
  readonly doubled = computed(() => this.count() * 2);
  readonly effectLog = signal<string[]>([]);

  // ── Step 3: a real component: product search ────────────────────────────
  readonly query = signal('');
  readonly products = signal<Product[]>(PRODUCTS);
  readonly filtered = computed(() => {
    const q = this.query().trim().toLowerCase();
    return this.products().filter((p) => p.name.toLowerCase().includes(q));
  });

  // ── Step 4: the week-one mutation bug ───────────────────────────────────
  readonly todos = signal<string[]>(['Record episode 1']);
  readonly todoCount = computed(() => this.todos().length);
  private todoCounter = 1;

  constructor() {
    const [readToy] = this.toyCount;
    createEffect(() => {
      const line = `toy effect ran: count = ${readToy()}`;
      console.log(line);
      this.toyLog.update((lines) => [...lines, line]);
    });

    // effect() is for side effects: logging, syncing to storage, poking a non-Angular widget.
    effect(() => {
      const line = `effect ran: count = ${this.count()}, doubled = ${this.doubled()}`;
      console.log(line);
      this.effectLog.update((lines) => [...lines, line]);
    });
  }

  toyIncrement() {
    const [read, write] = this.toyCount;
    write(read() + 1);
  }

  toySetSame() {
    const [read, write] = this.toyCount;
    write(read()); // Object.is(old, new) is true, so nobody is notified
  }

  // Step 4: the bug. Same array reference, no .set() / .update(): nobody is notified.
  addTodoWithPush() {
    this.todos().push(`Task ${++this.todoCounter} (pushed)`);
  }

  // Step 4: still the bug. We call set, but with the SAME reference, so Object.is says "unchanged".
  addTodoWithPushThenSet() {
    const list = this.todos();
    list.push(`Task ${++this.todoCounter} (pushed + set)`);
    this.todos.set(list);
  }

  // Step 4: the fix. A new array, handed to update().
  addTodoImmutably() {
    this.todos.update((list) => [...list, `Task ${++this.todoCounter} (update)`]);
  }

  reset() {
    this.toyLog.set([]);
    this.effectLog.set([]);
    this.count.set(0);
    this.todos.set(['Record episode 1']);
    this.todoCounter = 1;
  }
}
