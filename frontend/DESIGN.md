# Finch — Design Rules

This documents the design system already established in the codebase
(`src/index.css`, `src/components/ui/*`). It describes what's actually
there today, so new screens stay consistent instead of drifting.
Treat it as the source of truth before styling anything — update it
when a deliberate system-wide change is made, don't fork a new look
per screen.

## Identity

- Product name: **Finch**.
- Mark: a `PiggyBank` icon (lucide-react) inside a `size-8`
  `rounded-lg` `bg-primary` square, icon `size-4` `text-primary-foreground`.
  Used wherever the wordmark appears (auth screens today).

## Color

Monochrome by default — there is **no brand accent color**. `primary`
is near-black in light mode / near-white in dark mode (oklch, 0 chroma).
Color is reserved for meaning, not decoration:

- `--status-good` / `--status-critical` — up/down deltas, health states.
- `--chart-1` … `--chart-6` — chart series only.
- `--destructive` — errors, destructive actions.

All tokens live in `:root` / `.dark` in `src/index.css` as `oklch()`
values and are exposed as Tailwind colors (`bg-background`,
`text-foreground`, `bg-primary`, `border-border`, `bg-muted`, etc.) via
the `@theme inline` block. Never hardcode a hex/oklch color in a
component — add or reuse a token instead.

Don't introduce gradients, glassmorphism, or glow. Surfaces are flat;
separation comes from `ring-1 ring-foreground/10` (cards) or `border`
(header, inputs), not shadows.

**Exception — auth screens.** `AuthBrandPanel` (login/register) deliberately
breaks from flat/static: it layers an animated grid pan and three blurred,
slowly-drifting `chart-*` color blobs (`auth-blob-1/2/3`, `auth-grid-pan`
keyframes in `index.css`) over the `bg-primary` panel, and the form card
animates in (`animate-in fade-in slide-in-from-*`, via `tw-animate-css`).
This is scoped to the pre-auth moment only — don't carry blobs/motion into
the dashboard or any in-app screen, which stay flat and static. All
animation respects `prefers-reduced-motion`.

## Typography

- Font: Geist Variable (`@fontsource-variable/geist`), via
  `font-sans` / `font-heading`.
- Scale actually in use: `text-xs`, `text-sm` (default body/UI copy),
  `text-base`, `text-xl` (card/page titles), `text-2xl` (stat
  numbers). Don't go bigger than `text-2xl` outside a hero-style
  moment — this is a dashboard app, not a marketing site.
- Weight: `font-medium` for emphasis/labels/titles, `font-semibold`
  for the wordmark and large numbers. Body text is regular weight.

## Spacing & layout

- Page/section gaps: `gap-4` / `space-y-4`.
- Form field groups: `gap-1.5` between label and input, `gap-4`
  between fields.
- Page padding: `p-4`.
- Grid: dashboard content is `grid-cols-1 lg:grid-cols-3` style —
  responsive at `sm`/`lg` breakpoints, mobile-first.

## Radius

Driven by one token, `--radius: 0.625rem`, scaled via `--radius-sm`
through `--radius-4xl` in `@theme inline`. Components pick a step off
that scale (`rounded-lg` buttons/inputs/icon tiles, `rounded-xl`
cards, `rounded-4xl` badges/pills) — don't set an arbitrary radius.

## Components

- **Card**: `rounded-xl`, `ring-1 ring-foreground/10`, no shadow,
  `bg-card`. Internal spacing via the `--card-spacing` var, not
  hardcoded padding.
- **Button**: `h-8` default, `rounded-lg`. `default` variant is
  `bg-primary` (monochrome, not an accent color). `outline`/`ghost`/
  `secondary`/`destructive`/`link` cover the rest — reach for these
  before inventing a new visual treatment for an action.
- **Input**: `h-8`, `rounded-lg`, `border-input`, focus ring via
  `focus-visible:ring-ring/50`. Always paired with a `Label`.
- **Badge**: `rounded-4xl` pill, `h-5`, used for short status/category
  tags.
- Icons: `lucide-react`, default `size-4` inline, `size-3.5` for small
  inline metadata (deltas, timestamps).

## States & accessibility

- Every interactive element needs a visible focus ring
  (`focus-visible:ring-3 focus-visible:ring-ring/50` is already baked
  into `Button`/`Input` — don't override it away).
- Errors render as `text-sm text-destructive` inline near the thing
  that failed, not as a toast-only notification.
- Disabled/submitting states use `disabled:opacity-50` plus a changed
  label (e.g. "Signing in…"), not just a spinner with no text.
- Minimum touch target 44px on touch surfaces even though the base
  control height is `h-8` — add padding/hit-area on mobile rather than
  shrinking tap zones.

## Dark mode

Everything is token-driven so `.dark` just swaps the token values —
never branch styling with manual `dark:` colors unless the token
system genuinely has no equivalent yet.
