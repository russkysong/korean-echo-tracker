import Fuse from 'fuse.js';
import type { IFuseOptions } from 'fuse.js';
import { patterns, type Pattern } from '@/lib/patterns';

/** Shared with CopyKiller — fuzzy “keyword detector” over all pattern fields. */
export const PATTERN_FUSE_KEYS: NonNullable<IFuseOptions<Pattern>['keys']> = [
  { name: 'globalText', weight: 2 },
  { name: 'globalTextKo', weight: 1.5 },
  { name: 'koreanText', weight: 2 },
  { name: 'relatedKeywords', weight: 1.5 },
  { name: 'searchAliases', weight: 0.8 },
  { name: 'agendaTags', weight: 1 },
  { name: 'topic', weight: 1 },
  { name: 'koreanSourceLabelKo', weight: 0.6 },
  { name: 'globalSource', weight: 0.5 },
];

export const PATTERN_FUSE_OPTIONS: IFuseOptions<Pattern> = {
  keys: PATTERN_FUSE_KEYS,
  threshold: 0.35,
  includeScore: true,
  includeMatches: true,
};

export function createPatternFuse(): Fuse<Pattern> {
  return new Fuse(patterns, PATTERN_FUSE_OPTIONS);
}
