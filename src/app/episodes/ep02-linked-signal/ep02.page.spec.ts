import { TestBed } from '@angular/core/testing';
import { Ep02Page } from './ep02.page';

describe('Ep02Page', () => {
  async function setup() {
    TestBed.configureTestingModule({ imports: [Ep02Page] });
    const fixture = TestBed.createComponent(Ep02Page);
    await fixture.whenStable();
    const el = fixture.nativeElement as HTMLElement;
    const text = (id: string) => el.querySelector(`[data-testid="${id}"]`)?.textContent?.replace(/\s+/g, ' ').trim() ?? '';
    return { fixture, page: fixture.componentInstance, text };
  }

  it('plain signal keeps a stale selection, linkedSignal resets on category change', async () => {
    const { fixture, page, text } = await setup();
    page.selectedPlain.set(3);
    page.selectedLinked.set(3);
    await fixture.whenStable();
    expect(text('selected-linked')).toBe('Selected: Leather Boot');

    page.category.set('shirts');
    await fixture.whenStable();
    expect(text('selected-plain')).toBe('Selected: Leather Boot');
    expect(text('selected-linked')).toBe('Selected: Linen Shirt');
  });

  it('keeps the previous pick when it survives the filter', async () => {
    const { fixture, page } = await setup();
    page.selectedKeep.set(15); // Canvas Tote, 35 EUR
    page.maxPrice.set(60);
    await fixture.whenStable();
    expect(page.selectedKeep()).toBe(15);

    page.selectedKeep.set(4); // Canvas Slip-on, 60 EUR
    page.maxPrice.set(50);
    expect(page.selectedKeep()).toBe(11); // no longer affordable, falls back to the first match: Polo Shirt
  });

  it('resets pagination only for the linkedSignal version', async () => {
    const { fixture, page, text } = await setup();
    page.pagePlain.set(6);
    page.pageLinked.set(6);
    await fixture.whenStable();

    page.filterText.set('anna');
    await fixture.whenStable();
    expect(text('page-plain')).toBe('Page 6 of 1');
    expect(text('page-linked')).toBe('Page 1 of 1');
  });
});
