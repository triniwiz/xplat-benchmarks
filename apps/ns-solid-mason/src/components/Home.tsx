import { For } from 'solid-js';
import { SCENARIOS, SIZES } from '../shared/scenarios';
import { controller } from '../store';

export function Home() {
  return (
    <view class="home">
      <text class="home-title" textContent="xplat-benchmarks · NativeScript Solid + Mason" />
      <For each={SCENARIOS}>
        {(s) => (
          <view class="home-row">
            <text class="home-label" textContent={s.title} />
            <For each={SIZES}>{(size) => <text class="home-btn" textContent={size} on:tap={() => controller.show(s.id, size)} />}</For>
          </view>
        )}
      </For>
    </view>
  );
}
