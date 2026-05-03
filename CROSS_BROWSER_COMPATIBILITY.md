# Cross-Browser Compatibility Audit

Audit pentru suportul în Chrome, Firefox, Safari și Edge, cu focus pe ultimele 2 versiuni și Safari 14+.

## Rezumat

Am identificat 3 probleme reale de compatibilitate, toate în CSS. Nu am găsit API-uri JavaScript sau elemente HTML cu suport limitat care să fie folosite direct în codebase.

Scor general: 87/100.

## Probleme identificate

### 1. `100dvh` fără fallback

- Fișier: [app/globals.css](app/globals.css#L71)
- Problemă: `min-height: 100dvh`
- Browsere afectate: Safari 14.x și iOS Safari 14.x
- Observație: unitățile dynamic viewport nu sunt suportate complet înainte de Safari 15.4
- Fix recomandat: adaugă fallback la `100vh` și aplică `100dvh` prin `@supports` sau printr-o variabilă CSS

### 2. Proprietatea individuală `scale` în keyframes

- Fișier: [app/globals.css](app/globals.css#L170-L172)
- Problemă: keyframes folosesc `scale: 1 1`
- Browsere afectate: Safari 14.0 și iOS Safari 14.0-14.4
- Observație: suportul stabil pentru proprietățile transform individuale este incomplet în aceste versiuni
- Fix recomandat: înlocuiește cu `transform: scale(...)`

### 3. `aspect-ratio` prin utilitare Tailwind

- Fișier: [app/works/page.tsx](app/works/page.tsx#L142)
- Fișier: [components/Works.tsx](components/Works.tsx#L129)
- Fișier: [components/DesignProjectLayout.tsx](components/DesignProjectLayout.tsx#L118)
- Fișier: [components/DesignProjectLayout.tsx](components/DesignProjectLayout.tsx#L134)
- Fișier: [components/DesignProjectLayout.tsx](components/DesignProjectLayout.tsx#L142)
- Fișier: [components/DesignProjectLayout.tsx](components/DesignProjectLayout.tsx#L201)
- Fișier: [components/DesignProjectLayout.tsx](components/DesignProjectLayout.tsx#L255)
- Fișier: [components/DesignProjectLayout.tsx](components/DesignProjectLayout.tsx#L263)
- Problemă: utilitare precum `aspect-4/3`, `aspect-4/5`, `aspect-16/10`, `aspect-3/4`, `aspect-21/9`
- Browsere afectate: Safari 14.x și iOS Safari 14.x
- Observație: `aspect-ratio` nu este disponibil complet în Safari 14; Chrome 88+, Firefox 89+, Edge 88+ și Safari 15+ sunt ok
- Fix recomandat: wrapper cu padding-top sau dimensiuni explicite pe breakpoint-uri

## Priorități recomandate

1. Elimină dependența de `aspect-ratio` în zonele cu imagini, deoarece afectează direct layout-ul principal.
2. Adaugă fallback pentru `100dvh`, ca să eviți probleme de înălțime în Safari 14.
3. Rescrie keyframes-urile cu `scale` individual în `transform: scale(...)`, pentru a păstra animația pe Safari 14.

## Concluzie

Codebase-ul este în stare bună pentru browserele moderne, dar are o dependență vizibilă de CSS modern care rupe parțial suportul pentru Safari 14.x. Dacă Safari 14+ rămâne o țintă reală, merită rezolvate primele două probleme înainte de optimizări suplimentare.
