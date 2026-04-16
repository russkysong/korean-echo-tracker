import type { Metadata } from 'next';
import { AssemblyMonitor } from '@/components/AssemblyMonitor';
import { loadAssemblyMonitorState } from '@/lib/assembly-api';
import { patterns } from '@/lib/patterns';

export const revalidate = 3600;
/** Increase on Vercel if the first uncached load hits the platform timeout (heavy Open API fan-out). */
export const maxDuration = 120;

export const metadata: Metadata = {
  title: 'MoLEG keyword monitor | Korea Echo Tracker',
  description: 'Echo pattern keywords vs 정부 입법예고 (국민참여입법센터 ogLmPp REST)',
};

export default async function AssemblyPage() {
  const state = await loadAssemblyMonitorState();
  const agendaTagOptions = [...new Set(patterns.flatMap((p) => p.agendaTags))].sort((a, b) =>
    a.localeCompare(b)
  );

  return <AssemblyMonitor state={state} agendaTagOptions={agendaTagOptions} />;
}
