# Harnesses

Playwright scripts used while building. They read `docs/app.html`, so build first.

- `jump-test.js` — parks every segmented control and chip row at two scroll depths, clicks each
  option, and fails if the control moves. A filter that shortens the page must not throw the thing
  you clicked down the screen.
- `responsive-scan.js` — every persona and view at 1440 / 1280 / 1100 / 900 / 760, reporting any
  element that overflows its container or any page that scrolls sideways.
- `flow-walk.js` — walks the cross-persona flows and prints the nav counts, so a change made on one
  persona's screen can be checked on another's.

```
node tools/jump-test.js
```
