import { useEffect, useMemo, useState } from 'react';

const periods = ['1D', '1W', '1M', '3M', '1Y'];

const StockChart = ({ data = [], onPeriodChange }) => {
  const [period, setPeriod] = useState('1M');
  const [hovered, setHovered] = useState(null);

  useEffect(() => {
    if (onPeriodChange) onPeriodChange(period);
  }, [period, onPeriodChange]);

  const candles = useMemo(() => {
    if (!data.length) return [];
    const values = data.map((d, index) => {
      const price = Number(d.price);
      const previous = index ? Number(data[index - 1].price) : price;
      const spread = Math.max(price * 0.003, 1);
      return { open: previous, close: price, high: price + spread * (1 + (index % 3) * 0.35), low: Math.max(0.01, price - spread * (1 + (index % 2) * 0.25)), label: d.date ? new Date(d.date).toLocaleDateString() : d.time ?? index + 1 };
    });
    const highs = values.map((c) => c.high);
    const lows = values.map((c) => c.low);
    return { values, max: Math.max(...highs), min: Math.min(...lows) };
  }, [data]);

  if (!candles.values) {
    return <div className="rounded-2xl border border-slate-800 bg-slate-950 p-6 text-sm text-slate-400">Chart data is loading or unavailable.</div>;
  }

  const width = 760;
  const height = 280;
  const padding = 24;
  const range = candles.max - candles.min || 1;
  const step = (width - padding * 2) / Math.max(candles.values.length, 1);
  const y = (price) => height - padding - ((price - candles.min) / range) * (height - padding * 2);

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-xs uppercase tracking-[0.2em] text-slate-400">Simulated candlestick chart</p>
          {hovered && <p className="mt-1 text-xs text-slate-300">{hovered.label} · O {hovered.open.toFixed(2)} · C {hovered.close.toFixed(2)} · H {hovered.high.toFixed(2)} · L {hovered.low.toFixed(2)}</p>}
        </div>
        <div className="flex gap-2">
          {periods.map((p) => (
            <button key={p} onClick={() => setPeriod(p)} className={`rounded-lg px-2.5 py-1.5 text-xs transition ${period === p ? 'bg-cyan-500 text-slate-950' : 'border border-slate-800 bg-slate-950 text-slate-300'}`}>{p}</button>
          ))}
        </div>
      </div>

      <div className="overflow-hidden rounded-2xl border border-slate-800 bg-slate-950 p-2">
        <svg viewBox={`0 0 ${width} ${height}`} className="h-[280px] w-full" role="img" aria-label={`Candlestick chart for ${period}`}>
          {[0, 1, 2, 3, 4].map((line) => {
            const lineY = padding + line * ((height - padding * 2) / 4);
            return <line key={line} x1={padding} x2={width - padding} y1={lineY} y2={lineY} stroke="#1e293b" strokeDasharray="4 4" />;
          })}
          {candles.values.map((candle, index) => {
            const x = padding + step * index + step / 2;
            const up = candle.close >= candle.open;
            const top = y(Math.max(candle.open, candle.close));
            const bottom = y(Math.min(candle.open, candle.close));
            const bodyHeight = Math.max(bottom - top, 3);
            const color = up ? '#34d399' : '#fb7185';
            return (
              <g key={index} onMouseEnter={() => setHovered(candle)} onMouseLeave={() => setHovered(null)}>
                <line x1={x} x2={x} y1={y(candle.high)} y2={y(candle.low)} stroke={color} strokeWidth="1" />
                <rect x={x - Math.max(step * 0.25, 3)} y={top} width={Math.max(step * 0.5, 6)} height={bodyHeight} rx="1.5" fill={color} opacity="0.9" />
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
};

export default StockChart;
