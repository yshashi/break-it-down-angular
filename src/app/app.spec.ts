import { TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { App } from './app';
import { routes } from './app.routes';

describe('App', () => {
  it('renders the episode navigation', async () => {
    TestBed.configureTestingModule({ imports: [App], providers: [provideRouter(routes)] });
    const fixture = TestBed.createComponent(App);
    await fixture.whenStable();
    const links = [...(fixture.nativeElement as HTMLElement).querySelectorAll('nav a')].map((a) => a.textContent?.trim());
    expect(links).toEqual(['Break It Down.ng', '01 Signals', '02 linkedSignal', '03 RxJS interop']);
  });
});
