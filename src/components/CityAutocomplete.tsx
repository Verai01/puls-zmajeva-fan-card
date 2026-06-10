import { useMemo, useRef, useState } from "react";
import { MapPin } from "lucide-react";
import { citiesForCountry } from "@/lib/data/cities";
import { normalizeCity } from "@/lib/normalize";

interface CityAutocompleteProps {
  countryCode: string | null;
  value: string;
  onChange: (value: string) => void;
}

export function CityAutocomplete({
  countryCode,
  value,
  onChange,
}: CityAutocompleteProps) {
  const [open, setOpen] = useState(false);
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const cities = countryCode ? citiesForCountry(countryCode) : [];

  const matches = useMemo(() => {
    const q = normalizeCity(value);
    if (!q) return cities.slice(0, 8);
    return cities
      .filter((c) => normalizeCity(c).includes(q))
      .slice(0, 8);
  }, [cities, value]);

  const exactish = matches.some(
    (c) => normalizeCity(c) === normalizeCity(value),
  );

  return (
    <div className="relative">
      <div className="flex items-center gap-2 rounded-xl border border-input bg-[oklch(0.16_0.1_266)] px-3">
        <MapPin className="h-4 w-4 shrink-0 text-primary" />
        <input
          type="text"
          value={value}
          disabled={!countryCode}
          placeholder={countryCode ? "Počni tipkati grad…" : "Prvo izaberi državu"}
          onFocus={() => setOpen(true)}
          onBlur={() => {
            blurTimer.current = setTimeout(() => setOpen(false), 120);
          }}
          onChange={(e) => {
            onChange(e.target.value);
            setOpen(true);
          }}
          className="h-12 w-full bg-transparent text-base text-foreground placeholder:text-muted-foreground focus:outline-none disabled:opacity-50"
        />
      </div>

      {open && countryCode && (matches.length > 0 || value.trim().length > 0) && (
        <ul className="glass-card absolute z-30 mt-2 max-h-60 w-full overflow-auto rounded-xl p-1">
          {matches.map((c) => (
            <li key={c}>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => {
                  onChange(c);
                  setOpen(false);
                }}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm text-foreground hover:bg-accent/40"
              >
                <MapPin className="h-3.5 w-3.5 text-primary" />
                {c}
              </button>
            </li>
          ))}
          {value.trim().length > 0 && !exactish && (
            <li>
              <button
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => setOpen(false)}
                className="flex w-full items-center gap-2 rounded-lg px-3 py-2.5 text-left text-sm font-semibold text-primary hover:bg-accent/40"
              >
                ＋ Andere Stadt eingeben: „{value.trim()}”
              </button>
            </li>
          )}
        </ul>
      )}
    </div>
  );
}
