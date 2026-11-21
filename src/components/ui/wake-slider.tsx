import React, { useEffect, useRef, useState, useMemo, useCallback } from "react";
import NumberFlow from "@number-flow/react";
import { cn } from "@/lib/utils";
import "./wake-slider.css";

/* ══ Wake slider ══════════════════════════════════════════
   A range with no thumb: a row of thin bars, solid up to the
   value and faint after it, with the reading beside them. Drag
   anywhere along it. Drag slowly and the bars simply fill; drag
   fast and every bar the value sweeps past springs up, taller the
   faster you went, and settles back — a wake left behind the hand.

   ── EACH BAR HOLDS A LITTLE ENERGY ──────────────────────
   When the value crosses a bar, that bar takes energy from the
   speed of the drag. Every frame all of it decays at the same
   rate, so the bars crossed longest ago have fallen furthest: the
   tallest ones are always at the hand and the run tails off
   behind it. That falloff IS the wake; nothing draws it.

   ── INTEGRATED WITH NUMBERFLOW ─────────────────────────
   The reading beside the track smoothly animates using NumberFlow,
   respecting decimal steps, units, and custom layouts.
══════════════════════════════════════════════════════════ */

const H = 18; // a bar at rest, px
const GAP = 4; // bar pitch minus its width
const BAR = 3;
const clamp = (v: number, a: number, b: number) => Math.min(b, Math.max(a, v));

export interface WakeSliderProps {
  /** Valoarea curentă a sliderului (controlled) */
  value?: number;
  /** Valoare implicită inițială dacă nu este controlată (uncontrolled) */
  defaultValue?: number;
  /** Limita minimă (default: 0) */
  min?: number;
  /** Limita maximă (default: 100) */
  max?: number;
  /** Pasul de incrementare (default: 1) */
  step?: number;
  /** Unitate opțională afișată lângă număr (ex: "x", "%", "s", "px") */
  unit?: string;
  /** Numărul de bare pe pistă (12..64, default: 32) */
  bars?: number;
  /** Înălțimea maximă a undei energetice (0..100, default: 60) */
  wake?: number;
  /** Callback apelat când valoarea se modifică */
  onChange?: (val: number) => void;
  /** Dacă se afișează numărul cu NumberFlow lângă pistă (default: true) */
  showReading?: boolean;
  /** Dacă pista se extinde pe toată lățimea containerului (default: false) */
  fullWidth?: boolean;
  /** Clase CSS suplimentare pentru containerul .wks */
  className?: string;
  /** Label accesibilitate pentru cititoare de ecran */
  "aria-label"?: string;
  disabled?: boolean;
}

export const WakeSlider: React.FC<WakeSliderProps> = ({
  value: controlledValue,
  defaultValue = 50,
  min = 0,
  max = 100,
  step = 1,
  unit = "",
  bars = 32,
  wake = 60,
  onChange,
  showReading = true,
  fullWidth = false,
  className,
  "aria-label": ariaLabel = "Value",
  disabled = false,
}) => {
  const n = Math.round(clamp(bars, 12, 64));
  const isControlled = controlledValue !== undefined;
  const [internalValue, setInternalValue] = useState<number>(() =>
    isControlled ? controlledValue! : defaultValue
  );

  const value = isControlled ? controlledValue! : internalValue;

  // Calcul fracțiune (0..1) pe baza min și max
  const fraction = useMemo(() => {
    const span = max - min || 1;
    return clamp((value - min) / span, 0, 1);
  }, [value, min, max]);

  const track = useRef<HTMLDivElement | null>(null);
  const els = useRef<(HTMLSpanElement | null)[]>([]);
  const st = useRef({
    energy: new Float32Array(n),
    down: false,
    lastX: 0,
    lastT: 0,
    speed: 0,
    raf: 0,
    at: fraction,
    lastBar: Math.round(fraction * (n - 1)),
  });

  const knob = useRef(wake);
  knob.current = wake;

  // Sincronizare la schimbarea numărului de bare
  useEffect(() => {
    st.current.energy = new Float32Array(n);
  }, [n]);

  // Sincronizare fracțiune când valoarea externă se modifică
  useEffect(() => {
    st.current.at = fraction;
    st.current.lastBar = Math.round(fraction * (n - 1));
  }, [fraction, n]);

  // Bucla RAF de fizică a energiei undei (decay exponențial)
  const loop = useCallback(() => {
    const s = st.current;
    if (s.raf) return;
    let prev = performance.now();
    const run = (now: number) => {
      const dt = Math.min(0.05, (now - prev) / 1000);
      prev = now;
      let live = false;
      const fall = Math.exp(-dt * 6.5);
      for (let i = 0; i < s.energy.length; i++) {
        s.energy[i] *= fall;
        if (s.energy[i] < 0.002) s.energy[i] = 0;
        else live = true;
        const b = els.current[i];
        if (b) {
          b.style.transform = `scaleY(${(1 + s.energy[i] * 1.6).toFixed(3)})`;
        }
      }
      s.raf = live || s.down ? requestAnimationFrame(run) : 0;
    };
    s.raf = requestAnimationFrame(run);
  }, []);

  useEffect(() => {
    return () => {
      if (st.current.raf) cancelAnimationFrame(st.current.raf);
    };
  }, []);

  // Cuantificare valoare în funcție de pas și zecimale
  const quantify = useCallback(
    (f: number): number => {
      const span = max - min;
      let raw = min + f * span;
      if (step > 0) {
        const steps = Math.round((raw - min) / step);
        raw = min + steps * step;
      }
      raw = clamp(raw, min, max);
      const decimals = step < 1 ? (step.toString().split(".")[1] || "").length : 0;
      return Number(raw.toFixed(decimals));
    },
    [min, max, step]
  );

  // Deplasare la o fracțiune, transferând energie barelor traversate
  const to = useCallback(
    (f: number, speed: number) => {
      if (disabled) return;
      const s = st.current;
      f = clamp(f, 0, 1);
      const from = s.at;
      s.at = f;
      const a = Math.round(from * (n - 1));
      const b = Math.round(f * (n - 1));

      // Forța undei bazată pe viteza deplasării
      const push = (1 - Math.exp(-speed / 900)) * (knob.current / 60);
      const lo = Math.min(a, b);
      const hi = Math.max(a, b);
      for (let i = lo; i <= hi; i++) {
        s.energy[i] = Math.max(s.energy[i], push);
      }
      s.lastBar = b;

      const nextVal = quantify(f);
      if (!isControlled) {
        setInternalValue(nextVal);
      }
      onChange?.(nextVal);
      loop();
    },
    [disabled, n, quantify, isControlled, onChange, loop]
  );

  const fracFromClientX = (clientX: number) => {
    if (!track.current) return 0;
    const r = track.current.getBoundingClientRect();
    if (r.width <= 0) return 0;
    return (clientX - r.left) / r.width;
  };

  const lit = Math.round(fraction * (n - 1));

  // Determinare format zecimale pentru NumberFlow
  const fractionDigits = useMemo(() => {
    if (Number.isInteger(step)) return { min: 0, max: 0 };
    if (step < 0.1) return { min: 2, max: 2 };
    return { min: 1, max: 1 };
  }, [step]);

  return (
    <div
      className={cn(
        "wks",
        fullWidth && "w-full",
        disabled && "opacity-50 pointer-events-none",
        className
      )}
    >
      <div
        ref={track}
        className={cn("wks-track", fullWidth && "flex-1 min-w-0")}
        role="slider"
        tabIndex={disabled ? -1 : 0}
        aria-label={ariaLabel}
        aria-valuemin={min}
        aria-valuemax={max}
        aria-valuenow={value}
        style={{
          width: fullWidth ? undefined : n * (BAR + GAP) - GAP,
          height: H * 2.6,
        }}
        onPointerDown={(e) => {
          if (disabled) return;
          const s = st.current;
          try {
            e.currentTarget.setPointerCapture(e.pointerId);
          } catch {}
          s.down = true;
          s.lastX = e.clientX;
          s.lastT = performance.now();
          s.speed = 0;
          to(fracFromClientX(e.clientX), 0);
        }}
        onPointerMove={(e) => {
          const s = st.current;
          if (!s.down || disabled) return;
          const now = performance.now();
          const dt = Math.max(0.008, (now - s.lastT) / 1000);
          const v = Math.abs(e.clientX - s.lastX) / dt;
          s.speed = s.speed * 0.5 + v * 0.5;
          s.lastX = e.clientX;
          s.lastT = now;
          to(fracFromClientX(e.clientX), s.speed);
        }}
        onPointerUp={(e) => {
          st.current.down = false;
          try {
            e.currentTarget.releasePointerCapture(e.pointerId);
          } catch {}
        }}
        onPointerCancel={() => {
          st.current.down = false;
        }}
        onKeyDown={(e) => {
          if (disabled) return;
          const effectiveStep = e.shiftKey ? step * 5 : step;
          let nextVal: number | null = null;
          if (e.key === "ArrowRight" || e.key === "ArrowUp") nextVal = value + effectiveStep;
          if (e.key === "ArrowLeft" || e.key === "ArrowDown") nextVal = value - effectiveStep;
          if (e.key === "Home") nextVal = min;
          if (e.key === "End") nextVal = max;
          if (nextVal === null) return;
          e.preventDefault();
          const clamped = clamp(nextVal, min, max);
          const nextFrac = (clamped - min) / (max - min || 1);
          to(nextFrac, 600);
        }}
      >
        {Array.from({ length: n }, (_, i) => (
          <span
            key={i}
            ref={(b) => {
              els.current[i] = b;
            }}
            className="wks-bar"
            data-on={(fraction > 0 && i <= lit) || undefined}
            style={{ height: H }}
          />
        ))}
      </div>

      {showReading && (
        <div className="wks-value">
          <NumberFlow
            value={value}
            format={{
              minimumFractionDigits: fractionDigits.min,
              maximumFractionDigits: fractionDigits.max,
            }}
          />
          {unit && <span className="ml-0.5 text-muted-foreground font-normal">{unit}</span>}
        </div>
      )}
    </div>
  );
};

/* ══ WakeSliderField ════════════════════════════════════════
   Un wrapper complet cu etichetă, suport pentru reset la dublu-click
   pe valoarea inițială, și două variante de layout:
   - "inline": stil card Showcase (etichetă stânga, slider + valoare dreapta)
   - "stacked": stil Studio (etichetă și valoare sus, slider dedesubt)
══════════════════════════════════════════════════════════════ */

export interface WakeSliderFieldProps extends WakeSliderProps {
  label: string;
  defaultValue?: number;
  layout?: "inline" | "stacked";
  fieldClassName?: string;
}

export const WakeSliderField: React.FC<WakeSliderFieldProps> = ({
  label,
  value,
  defaultValue,
  layout = "inline",
  fieldClassName,
  onChange,
  unit,
  bars,
  ...sliderProps
}) => {
  const effectiveBars = bars ?? (layout === "inline" ? 18 : 32);

  const handleReset = () => {
    if (defaultValue !== undefined && onChange) {
      onChange(defaultValue);
    }
  };

  if (layout === "stacked") {
    return (
      <div className={cn("wks-field-stacked py-1", fieldClassName)}>
        <div className="flex items-center justify-between text-xs">
          <span
            onDoubleClick={handleReset}
            className={cn(
              "text-[11px] font-medium text-muted-foreground select-none truncate",
              defaultValue !== undefined && "cursor-pointer hover:text-foreground transition-colors"
            )}
            title={
              defaultValue !== undefined
                ? `${label} (Dublu-click pentru reset la ${defaultValue}${unit || ""})`
                : label
            }
          >
            {label}
          </span>
        </div>
        <WakeSlider
          {...sliderProps}
          bars={effectiveBars}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          unit={unit}
          showReading={true}
          className="w-full justify-between"
        />
      </div>
    );
  }

  // Layout inline default (stil Card / Showcase)
  return (
    <div
      className={cn(
        "h-11 px-3.5 bg-secondary/80 hover:bg-secondary border border-border rounded-xl flex items-center justify-between gap-3 transition-colors",
        fieldClassName
      )}
    >
      <span
        onDoubleClick={handleReset}
        className={cn(
          "text-xs font-normal text-muted-foreground select-none shrink-0 truncate max-w-[85px]",
          defaultValue !== undefined && "cursor-pointer hover:text-foreground transition-colors"
        )}
        title={
          defaultValue !== undefined
            ? `${label} (Dublu-click pentru reset la ${defaultValue}${unit || ""})`
            : label
        }
      >
        {label}
      </span>
      <div className="flex-1 min-w-0 flex items-center justify-end">
        <WakeSlider
          {...sliderProps}
          bars={effectiveBars}
          value={value}
          defaultValue={defaultValue}
          onChange={onChange}
          unit={unit}
          fullWidth={sliderProps.fullWidth ?? true}
          showReading={true}
        />
      </div>
    </div>
  );
};

export default WakeSlider;
