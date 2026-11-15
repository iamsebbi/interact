# Cross-Browser Compatibility Audit

Audit pentru suportul în Chrome, Firefox, Safari și Edge, cu focus pe ultimele 2 versiuni și Safari 14+.

## Rezumat

După curățarea CSS-ului din [app/globals.css](app/globals.css), problemele legate de `100dvh` fără fallback și proprietatea individuală `scale` în keyframes au fost remediate. Singurul feature CSS modern rămas pentru layout-uri este `aspect-ratio` (folosit prin utilitare Tailwind pe containere media).

## Status elemente verificate

### 1. `100dvh` cu fallback (Rezolvat)
- **Fișier:** [app/globals.css](app/globals.css) și [components/Hero.tsx](components/Hero.tsx)
- **Status:** Există `min-height: 100vh;` înainte de `min-height: 100dvh;` în `globals.css`, iar `Hero.tsx` folosește `min-h-screen min-h-[100dvh]`.

### 2. Proprietatea individuală `scale` în keyframes (Rezolvat)
- **Fișier:** [app/globals.css](app/globals.css)
- **Status:** Keyframe-ul nefolosit `@keyframes slider-pulse` (care folosea `scale: 1 1`) a fost eliminat.

### 3. `aspect-ratio` prin utilitare Tailwind
- **Fișiere:**
  - [components/ProjectIndex.tsx](components/ProjectIndex.tsx) (via `project.aspectClass` din [lib/index-projects.ts](lib/index-projects.ts))
  - [components/ProjectDetailClient.tsx](components/ProjectDetailClient.tsx) (`aspect-[16/10]`, `aspect-[9/16]`, `aspect-[2560/1098]`)
  - [components/Services.tsx](components/Services.tsx) (`aspect-[491/508]`)
  - [components/BrutalistDivider.tsx](components/BrutalistDivider.tsx) (`aspect-square`)
- **Observație:** Suport nativ în Chrome 88+, Firefox 89+, Edge 88+ și Safari 15+. Safari 14.x nu suportă complet `aspect-ratio` pe containere flex/grid fără înălțime explicită; dacă Safari 14 rămâne țintă obligatorie, aceste containere pot primi fallback cu `padding-bottom` procentual.
