# AGENTS.md

## ui-sdk

Before using `ui-sdk`, follow the `ui-sdk` skill if it's installed, and read `node_modules/@ui-sdk/react/docs/llms.txt`. To build a new component, also search `node_modules/@ui-sdk/react/docs/core.md` by heading, and read `rendering.md` next to it (`node_modules/@ui-sdk/react/docs/rendering.md`).

- 100% unified on `@ui-sdk/react` and `@ui-sdk/core` — never add `@base-ui/react`.
- Always keep `@layer ui-sdk;` at the very top of `src/app/globals.css`, above `@import "tailwindcss";`.
- Import each component from its own entry (`@ui-sdk/react/button`, `@ui-sdk/react/dialog`, etc.), never from the package root.

## architecture

- `src/registry/items/<slug>/`: colocated component modules (`<slug>.tsx`, `config.ts`, `demo.tsx`, `inspector.tsx`, `meta.ts`). Distributable `<slug>.tsx` files never import from `src/components/`. Every `registry.json` file entry must specify an explicit `target` (e.g. `components/ui/<slug>.tsx`).
- `src/registry/icons/`: shared animate-ui icons required by registry items.
- `src/registry/manifest.ts`: pure JSON-serializable `CATALOG_META` (zero React, zero CSS, zero functions) — safe for Server Components and Node scripts (`scripts/check-registry.ts`).
- `src/registry/generators.ts`: pure TypeScript JSX/prompt builders (`config.ts`) — safe on Server and Client.
- `src/registry/client.ts`: client-only `next/dynamic` lazy registry resolving `Preview`, `Demo`, and `Inspector` by slug.
- `src/components/`: internal site UI (layout, showcase, studio, controls) — never part of the shadcn registry.
- `src/lib/`: shared utilities (`utils.ts`, server-only `shiki.ts`, `registry-source.ts`).

## distortion-waves

When building any component or demo using `DistortionWave`:

- Put `borderRadius`, `overflow: "hidden"`, outer hairline/border, and `boxShadow` on `<DistortionWave style={...} />`, never on the root of `children` or `revealedContent` (otherwise the card outline bends during the WebGL2 wave).
- Give both `children` and `revealedContent` strictly opaque backgrounds and `borderStyle: "none"` on their root container (explicit inline `border` / `borderTop` only on inner inset boxes or row dividers).
- Pass the origin element/ref as `source` (bottom button for `"vertical"`, left rail for `"horizontal"`, top/center icon/token/avatar for `"center"`) and keep live unbent controls inside `overlay`.
- Use local assets (or CORS-enabled URLs) for images inside snapshots; use `ref.current?.reset()` before `setRevealed(false)` when resetting without a reverse wave.
