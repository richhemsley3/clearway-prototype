# Clearway

A design prototype for a payment network's three audiences, built as single-file HTML.

**[View the prototypes →](https://richhemsley3.github.io/clearway-prototype/)**

---

## What this is

Three people are looking at the same three accounts from three sides:

- **The agent**, inside the network, running a book of 24 partner accounts — moving a deal from
  introduction through risk and contracting, then handing it to operations.
- **The participant**, outside it, at three points in a lifecycle — applying, boarding, and live.
- **The developer** at that participant, working from sandbox through certification to
  pre-production.

The three are wired to the same data, so the state moves between them. Fix a failing certification
case as the engineer and the agent's go-live risk moves with it. Chase a signature as the agent and
the applicant's queue empties. A row that says *waiting on a signature* on one screen is the row
someone is being asked to sign on another.

## Everything here is invented

Clearway is not a real network. Ridgeline Freight, Northgate Financial, Meridian Trust, every person
named, every figure, every response code and every date are fictional, written to carry a design
argument rather than to describe anything that exists. Nothing in this repository is confidential
material belonging to any organisation.

## The design rules it holds to

The prototypes obey a small set of rules, and most of the decisions follow from them:

- **One accent.** A single signal colour, used at most twice on a screen — the primary action and
  the marker on the thing that needs you. When nothing is urgent, the marker goes grey.
- **One hierarchy lever.** Size, not weight. One type weight throughout.
- **Hairlines, not shadows.** Separation by rule or by tone; shadows only on overlays.
- **Tables and rows are the workhorse.** Dashboards are secondary; cards are mostly absent.
- **Whose turn it is, as a column.** Every queue says who owes the next move — you or us — and
  every item names what it holds up, on a date.
- **Tabs switch data sets. Segmented controls slice one.** Chips are a secondary facet on top.
- **No fake denominators.** No "step 3 of 7" on a branching flow, no percentage on a set of
  milestones, no fixed test-case count on a plan that is generated per configuration.

## Structure

```
build.py            assembles a prototype from its parts
src/                the parts
  clearway.css        the design system: tokens, components, responsive rules
  app-body.html       the shell and views for the three-persona app
  spine.txt           the shared data — one deal, three sides
  pjs.txt             the three experiences, reading and writing the spine
  pviews.txt          view markup for the participant, agent and developer screens
  txviews.txt         transaction reporting views, reused as the live participant's modules
  txjs.txt            and their renderers
  *-body.html         each earlier prototype
docs/               the built pages, served by GitHub Pages
tools/              screenshot and QA harnesses used while building
```

Nothing is compiled and there is no framework. `build.py` substitutes the parts into a body file and
wraps the result in a document:

```
python3 build.py src/app-body.html docs/app.html
```

Markers are filled in order — `/*FONTS*/`, `/*CSS*/`, then the data and view parts — and the order
matters, because `txjs.txt` itself contains a `/*DATA*/` marker that has to be inserted before that
marker is filled.

## Typeface

The working files are drawn in a licensed studio typeface, which is not redistributed here. This
build substitutes [Figtree](https://fonts.google.com/specimen/Figtree), so the type is close but not
identical to the design as drawn.

If you have a licensed copy, put its `@font-face` rules — with the font data embedded or served from
your own domain — in `src/fonts.txt` and build with `--embed-fonts`:

```
python3 build.py src/app-body.html app.html --embed-fonts
```

## How it was built

With [Claude](https://claude.com/claude-code), across a long working session: brief first, then
research into how real products in this space actually behave — applicant portals, certification
toolkits, live servicing dashboards — then build, then a heuristic pass that threw a lot of the first
version away.
