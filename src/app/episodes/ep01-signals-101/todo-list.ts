import { Component, input } from '@angular/core';

// A tiny child component. It only re-renders when its `todos` input
// receives a NEW value (compared with Object.is), just like any signal.
@Component({
  selector: 'app-todo-list',
  template: `
    <ul class="plain">
      @for (todo of todos(); track $index) {
        <li>{{ todo }}</li>
      }
    </ul>
  `,
})
export class TodoList {
  readonly todos = input.required<string[]>();
}
