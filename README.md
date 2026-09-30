# Break It Down: Angular

Companion code for the **Break It Down** YouTube series by [Sashikumar Yadav](https://sashikumar.dev) (Google Developer Expert, Angular).

Every episode takes one Angular idea and breaks it down twice:

1. **How it works inside**: we rebuild a small version from scratch, so nothing feels like magic.
2. **How you use it in a real project**: a working demo, side by side with the bug it fixes.

Built with **Angular 22** (standalone, zoneless, OnPush by default).

## Season 1: Signals Foundations

| # | Episode | Code | Route |
|---|---------|------|-------|
| 01 | Signals 101: `signal`, `computed`, `effect` | [`episodes/ep01-signals-101`](src/app/episodes/ep01-signals-101) | `/ep01` |
| 02 | `linkedSignal`: the signal that syncs itself | [`episodes/ep02-linked-signal`](src/app/episodes/ep02-linked-signal) | `/ep02` |
| 03 | Signals meet RxJS: `toSignal` and `toObservable` | [`episodes/ep03-rxjs-interop`](src/app/episodes/ep03-rxjs-interop) | `/ep03` |

More episodes land here as they are published.

## Run it

Requires Node **22.22.3+** or **24.15+** (see `.nvmrc`).

```bash
git clone https://github.com/yshashi/break-it-down-angular.git
cd break-it-down-angular
npm install
npm start          # http://localhost:4200
npm test           # runs every episode's tests (Vitest)
```

No backend needed. `src/app/shared/product-api.ts` is a fake API with real network behavior: a delay, and cancellation when you unsubscribe. Every request it serves is shown on screen.

## Project layout

```
src/app/
├── shared/
│   ├── data.ts              # mock products and orders
│   └── product-api.ts       # fake HTTP API with a visible request log
└── episodes/
    ├── ep01-signals-101/
    │   ├── toy-signal.ts    # a signal built from scratch, no Angular
    │   ├── ep01.page.ts     # the real API + product search + the mutation bug
    │   └── README.md
    ├── ep02-linked-signal/
    │   ├── toy-linked-signal.ts
    │   ├── ep02.page.ts     # category picker, price filter, pagination
    │   └── README.md
    └── ep03-rxjs-interop/
        ├── toy-interop.ts   # myToSignal / myToObservable
        ├── ep03.page.ts     # debounced search vs naive search
        └── README.md
```

Each episode folder has its own README with the key ideas and the exact clicks to reproduce the demo.

## License

MIT
