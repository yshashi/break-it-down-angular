import { Injectable, signal } from '@angular/core';
import { Observable } from 'rxjs';
import { PRODUCTS, Product } from './data';

export type RequestStatus = 'pending' | 'done' | 'cancelled';

export interface RequestLogEntry {
  id: number;
  channel: string;
  query: string;
  status: RequestStatus;
}

/**
 * A fake HTTP API. It behaves like HttpClient where it matters for the demos:
 * - results arrive after a network delay
 * - unsubscribing before the response arrives cancels the request
 * Every request is written to `log` so the UI can show what really hit the "server".
 */
@Injectable({ providedIn: 'root' })
export class ProductApi {
  private nextId = 1;
  readonly log = signal<RequestLogEntry[]>([]);

  /** All products, like GET /api/products. */
  getAll(latencyMs = 800): Observable<Product[]> {
    return this.request('catalog', '*', latencyMs, () => PRODUCTS);
  }

  /** Name search, like GET /api/search?q=... */
  search(query: string, channel: string, latencyMs = 600): Observable<Product[]> {
    const q = query.trim().toLowerCase();
    return this.request(channel, query, latencyMs, () =>
      PRODUCTS.filter((p) => p.name.toLowerCase().includes(q)),
    );
  }

  clearLog(channel?: string) {
    this.log.update((entries) => (channel ? entries.filter((e) => e.channel !== channel) : []));
  }

  private request<T>(channel: string, query: string, latencyMs: number, respond: () => T): Observable<T> {
    return new Observable<T>((subscriber) => {
      const id = this.nextId++;
      this.log.update((entries) => [...entries, { id, channel, query, status: 'pending' }]);

      const timer = setTimeout(() => {
        this.setStatus(id, 'done');
        subscriber.next(respond());
        subscriber.complete();
      }, latencyMs);

      // Teardown runs on unsubscribe. If the response has not arrived yet, the request was cancelled.
      return () => {
        clearTimeout(timer);
        if (this.log().find((e) => e.id === id)?.status === 'pending') {
          this.setStatus(id, 'cancelled');
        }
      };
    });
  }

  private setStatus(id: number, status: RequestStatus) {
    this.log.update((entries) => entries.map((e) => (e.id === id ? { ...e, status } : e)));
  }
}
