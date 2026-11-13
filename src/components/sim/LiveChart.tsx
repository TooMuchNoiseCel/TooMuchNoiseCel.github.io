'use client';

export interface ChartSeries {
  label: string;
  color: string;
  values: number[];
}

interface LiveChartProps {
  title: string;
  series: ChartSeries[];
  min: number;
  max: number;
  unit?: string;
  decimals?: number;
  height?: number;
}

/**
 * Gráfica de líneas ligera (SVG) con la estética de las gráficas reales:
 * fondo oscuro, rejilla tenue y una línea por serie.
 */
export default function LiveChart({
  title,
  series,
  min,
  max,
  unit = '',
  decimals = 0,
  height = 112,
}: LiveChartProps) {
  const toPoints = (values: number[]) => {
    const count = values.length;
    if (count === 0) return '';
    return values
      .map((value, index) => {
        const x = count === 1 ? 0 : (index / (count - 1)) * 100;
        const ratio = Math.min(1, Math.max(0, (value - min) / (max - min || 1)));
        return `${x.toFixed(2)},${(100 - ratio * 100).toFixed(2)}`;
      })
      .join(' ');
  };

  const format = (value: number) => {
    if (Math.abs(value) >= 10_000) return `${Math.round(value / 100) / 10}k`;
    return value.toFixed(decimals);
  };

  const main = series[0];
  const current = main && main.values.length > 0 ? main.values[main.values.length - 1] : null;

  return (
    <div className="rounded-xl border border-neutral-800 bg-[#0c0c0f] p-3">
      <div className="mb-2 flex items-baseline justify-between gap-2">
        <div className="flex min-w-0 items-baseline gap-2">
          <span className="truncate text-[10px] font-medium uppercase tracking-[0.18em] text-neutral-500">
            {title}
          </span>
          {current !== null && (
            <span className="font-mono text-[10px] text-neutral-300">
              {current.toFixed(decimals)}
              <span className="ml-0.5 text-neutral-600">{unit}</span>
            </span>
          )}
        </div>
        <div className="flex shrink-0 items-center gap-3">
          {series.map((item) => (
            <span key={item.label} className="flex items-center gap-1 text-[9px] text-neutral-400">
              <i className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: item.color }} />
              {item.label}
            </span>
          ))}
        </div>
      </div>

      <div className="relative" style={{ height }}>
        <div className="pointer-events-none absolute inset-y-0 left-0 flex w-9 flex-col justify-between pr-1 text-right text-[8px] leading-none text-neutral-600">
          <span>{format(max)}</span>
          <span>{format((max + min) / 2)}</span>
          <span>{format(min)}</span>
        </div>

        <div className="absolute inset-y-0 right-0 left-9">
          <svg
            className="h-full w-full"
            viewBox="0 0 100 100"
            preserveAspectRatio="none"
            aria-hidden="true"
          >
            {[0, 50, 100].map((y) => (
              <line
                key={y}
                x1="0"
                x2="100"
                y1={y}
                y2={y}
                stroke="#232327"
                strokeWidth={1}
                vectorEffect="non-scaling-stroke"
              />
            ))}

            {main && main.values.length > 1 && (
              <polygon
                points={`0,100 ${toPoints(main.values)} 100,100`}
                fill={main.color}
                opacity={0.08}
              />
            )}

            {series.map((item) => (
              <polyline
                key={item.label}
                points={toPoints(item.values)}
                fill="none"
                stroke={item.color}
                strokeWidth={1.5}
                strokeLinejoin="round"
                strokeLinecap="round"
                vectorEffect="non-scaling-stroke"
              />
            ))}
          </svg>
        </div>
      </div>
    </div>
  );
}
