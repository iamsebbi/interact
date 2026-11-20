# interact.dev

Interactive React UI components & live customization Studio built with **React**, **TypeScript**, **Tailwind CSS**, **Motion**, **Base UI**, and **Animate UI** icons.

## Components

All components are free and distributed via a **shadcn CLI** compatible registry (`registry.json` -> `public/r/*.json`):

| Component | Description | Install Command |
| :--- | :--- | :--- |
| **Bot Avatar** | Interactive 2.5D SVG avatar with 3D gaze tracking, organic blinking, 7 shapes, and 10 expressions | `npx shadcn@latest add https://interactdev.vercel.app/r/bot-avatar.json` |
| **Color Picker** | HSVA color picker with spring-physics loupe, HEX/RGB/HSL channels, alpha slider, and eyedropper | `npx shadcn@latest add https://interactdev.vercel.app/r/color-picker.json` |
| **OKLCH Palette** | Perceptually uniform OKLCH color ramp generator with elastic SVG goo transitions | `npx shadcn@latest add https://interactdev.vercel.app/r/palette.json` |
| **Wake Slider** | Kinetic bar-track range slider with velocity-driven wave wake and NumberFlow readout | `npx shadcn@latest add https://interactdev.vercel.app/r/wake-slider.json` |
| **Squircle Gradient** | Layered SVG & CSS squircle gradient tile with organic shapes, rim lighting, film grain, and border beams | `npx shadcn@latest add https://interactdev.vercel.app/r/gradient.json` |

### Optional Registry Namespace

Add `@interact` to your project's `components.json`:

```json
{
  "registries": {
    "@interact": "https://interactdev.vercel.app/r/{name}.json"
  }
}
```

Then install components with:

```bash
npx shadcn@latest add @interact/bot-avatar
```

## Development

```bash
npm install
npm run dev
```

### Scripts

- `npm run dev` — Start Vite dev server
- `npm run typecheck` — Run TypeScript compiler check (`tsc --noEmit`)
- `npm run registry:build` — Build shadcn registry JSON files into `public/r/`
- `npm run build` — Build shadcn registry and Vite production bundle into `dist/`
- `npm run preview` — Preview production build locally

## License

[MIT](./LICENSE) © 2026 iamsebbi
