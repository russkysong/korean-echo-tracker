'use client';

import {
  Bar,
  BarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from 'recharts';
import { patterns } from '@/lib/patterns';

function getYear(dateStr: string): number {
  const matches = dateStr.match(/\b(19|20)\d{2}\b/g);
  return matches ? parseInt(matches[matches.length - 1], 10) : 0;
}

const yearCounts = patterns.reduce(
  (acc: Record<number, number>, p) => {
    const y = getYear(p.date);
    if (y > 0) acc[y] = (acc[y] || 0) + 1;
    return acc;
  },
  {}
);

const timelineData = Object.entries(yearCounts)
  .sort(([a], [b]) => Number(a) - Number(b))
  .map(([year, count]) => ({ year: Number(year), count }));

export function HistoricTimeline() {
  if (timelineData.length === 0) {
    return (
      <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8 text-zinc-500 text-sm">
        No parseable years in <code className="text-zinc-400">date</code> fields yet.
      </div>
    );
  }

  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-3xl p-8">
      <h3 className="text-emerald-400 font-mono mb-6">
        Patterns by inferred year (from <code className="text-zinc-400">date</code> text)
      </h3>
      <ResponsiveContainer width="100%" height={320}>
        <BarChart data={timelineData}>
          <XAxis dataKey="year" stroke="#a3a3a3" />
          <YAxis allowDecimals={false} stroke="#a3a3a3" />
          <Tooltip />
          <Bar dataKey="count" fill="#10b981" />
        </BarChart>
      </ResponsiveContainer>
    </div>
  );
}
