'use server';

import { revalidateTag } from 'next/cache';

/** Busts the 1h `unstable_cache` for `/assembly` (see `lib/assembly-api.ts`). */
export async function revalidateAssemblyMonitor(): Promise<void> {
  revalidateTag('assembly-monitor');
}
