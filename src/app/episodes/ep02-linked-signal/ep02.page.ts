import { Component, computed, linkedSignal, signal } from '@angular/core';
import { CATEGORIES, Category, ORDERS, PRODUCTS, Product } from '../../shared/data';

const PAGE_SIZE = 8;

@Component({
  selector: 'app-ep02-page',
  templateUrl: './ep02.page.html',
})
export class Ep02Page {
  readonly categories = CATEGORIES;

  // ── Step 1: usually derived, sometimes overridden ───────────────────────
  readonly category = signal<Category>('shoes');
  readonly productsInCategory = computed(() => PRODUCTS.filter((p) => p.category === this.category()));

  // Before: a plain writable signal. Nobody resets it when the category changes.
  readonly selectedPlain = signal<number | null>(PRODUCTS[0].id);

  // computed() would reset correctly, but it is read-only:
  //   readonly selectedComputed = computed(() => this.productsInCategory()[0]?.id);
  //   this.selectedComputed.set(7); // TS error: Property 'set' does not exist on type 'Signal<number>'

  // After: linkedSignal. Resets when its dependencies change, writable in between.
  readonly selectedLinked = linkedSignal(() => this.productsInCategory()[0]?.id ?? null);

  // ── Step 2: the long form, with `source` and `previous` ────────────────
  readonly maxPrice = signal(200);
  readonly affordable = computed(() => PRODUCTS.filter((p) => p.price <= this.maxPrice()));

  // Keep the user's pick if it survived the new filter, otherwise fall back to the first item.
  readonly selectedKeep = linkedSignal<Product[], number | null>({
    source: this.affordable,
    computation: (list, previous) => {
      if (previous && list.some((p) => p.id === previous.value)) {
        return previous.value;
      }
      return list[0]?.id ?? null;
    },
  });

  // ── Step 3: in a real project: pagination ──────────────────────────────
  readonly filterText = signal('');
  readonly filteredOrders = computed(() => {
    const q = this.filterText().trim().toLowerCase();
    return ORDERS.filter((o) => o.customer.toLowerCase().includes(q));
  });
  readonly totalPages = computed(() => Math.max(1, Math.ceil(this.filteredOrders().length / PAGE_SIZE)));

  // Before: a plain signal. Filter while on page 7 and you stay on page 7 of 1.
  readonly pagePlain = signal(1);

  // After: reset to page 1 whenever the filter changes. The user can still page manually.
  readonly pageLinked = linkedSignal({
    source: this.filterText,
    computation: () => 1,
  });

  readonly rowsPlain = computed(() => this.pageOf(this.pagePlain()));
  readonly rowsLinked = computed(() => this.pageOf(this.pageLinked()));

  nameOf(id: number | null): string {
    return PRODUCTS.find((p) => p.id === id)?.name ?? 'nothing';
  }

  isInCategory(id: number | null): boolean {
    return this.productsInCategory().some((p) => p.id === id);
  }

  private pageOf(page: number) {
    const start = (page - 1) * PAGE_SIZE;
    return this.filteredOrders().slice(start, start + PAGE_SIZE);
  }
}
