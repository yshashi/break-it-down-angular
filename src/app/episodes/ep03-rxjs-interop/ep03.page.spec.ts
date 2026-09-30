import { TestBed } from '@angular/core/testing';
import { Subject } from 'rxjs';
import { Ep03Page } from './ep03.page';
import { myToObservable, myToSignal } from './toy-interop';
import { ProductApi } from '../../shared/product-api';
import { Component, signal } from '@angular/core';

const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

describe('toy interop (Episode 3)', () => {
  it('myToSignal follows the observable and unsubscribes on destroy', () => {
    const source = new Subject<number>();

    @Component({ template: '' })
    class Host {
      readonly value = myToSignal(source, { initialValue: 0 });
    }

    const fixture = TestBed.createComponent(Host);
    expect(fixture.componentInstance.value()).toBe(0);
    source.next(42);
    expect(fixture.componentInstance.value()).toBe(42);

    fixture.destroy();
    expect(source.observed).toBe(false);
  });

  it('myToObservable coalesces synchronous writes into one emission', async () => {
    const seen: number[] = [];

    @Component({ template: '' })
    class Host {
      readonly count = signal(0);
      constructor() {
        myToObservable(this.count).subscribe((v) => seen.push(v));
      }
    }

    const fixture = TestBed.createComponent(Host);
    await fixture.whenStable();
    fixture.componentInstance.count.set(1);
    fixture.componentInstance.count.set(2);
    fixture.componentInstance.count.set(3);
    await fixture.whenStable();

    expect(seen).toEqual([0, 3]);
  });
});

describe('Ep03Page', () => {
  async function setup() {
    TestBed.configureTestingModule({ imports: [Ep03Page] });
    const fixture = TestBed.createComponent(Ep03Page);
    await fixture.whenStable();
    return { fixture, page: fixture.componentInstance, api: TestBed.inject(ProductApi) };
  }

  it('debounced search sends one request for a burst of keystrokes; naive search sends one per keystroke', async () => {
    const { fixture, page } = await setup();
    for (const q of ['l', 'le', 'lea', 'leat', 'leath', 'leathe', 'leather']) {
      page.onNaiveInput(q);
      page.onInput(q);
      await fixture.whenStable();
      await wait(40);
    }
    await wait(1000);
    await fixture.whenStable();

    expect(page.naiveStats()).toEqual({ sent: 7, cancelled: 6, completed: 1 });
    expect(page.debouncedStats()).toEqual({ sent: 1, cancelled: 0, completed: 1 });
    expect(page.results().map((p) => p.name)).toEqual(['Leather Boot', 'Leather Wallet']);
  });

  it('toSignal outside an injection context throws NG0203', async () => {
    const { page } = await setup();
    page.loadInsideAMethod();
    expect(page.mistakeError()).toContain('NG0203');
  });
});
