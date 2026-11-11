import { batch, signal } from 'nsh';
import type { ScenarioFixture } from './shared/generate';

export const APP = 'nsh';

export const current = signal<ScenarioFixture | null>(null);
export const status = signal(`${APP} · ready`);

export const frameWidth = signal<'100%' | '80%'>('100%');
export const restyled = signal(false);
export const inserted = signal(false);

export const MUTATIONS = {
  shrink: () => frameWidth.set('80%'),
  grow: () => frameWidth.set('100%'),
  restyle: () => restyled.set(true),
  restore: () => restyled.set(false),
  insert: () => inserted.set(true),
  remove: () => inserted.set(false),
} satisfies Record<string, () => void>;

export type Mutation = keyof typeof MUTATIONS;

export const isMutation = (name: string): name is Mutation => Object.hasOwn(MUTATIONS, name);

export function render(f: ScenarioFixture | null) {
  batch(() => {
    if (f) {
      frameWidth.set('100%');
      restyled.set(false);
      inserted.set(false);
    }
    current.set(f);
  });
}
