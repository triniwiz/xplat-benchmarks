import { For } from 'solid-js';
import { SCENARIOS, SIZES } from '../shared/scenarios';
import { controller } from '../store';

export function Home() {
  return (
    <stacklayout class="home">
      <label class="home-title" text="xplat-benchmarks · NativeScript Solid + Mason" />
      <For each={SCENARIOS}>
        {(s) => (
          <gridlayout class="home-row" columns="*,auto,auto,auto">
            <label class="home-label" text={s.title} />
            <For each={SIZES}>
              {(size, i) => <label class="home-btn" col={i() + 1} text={size} on:tap={() => controller.show(s.id, size)} />}
            </For>
          </gridlayout>
        )}
      </For>
    </stacklayout>
  );
}
