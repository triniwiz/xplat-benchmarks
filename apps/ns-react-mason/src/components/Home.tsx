import { SCENARIOS, SIZES } from '../shared/scenarios';
import { controller } from '../store';

export function Home() {
  return (
    <view className="home">
      <text className="home-title" textContent="xplat-benchmarks · NativeScript React + Mason" />
      {SCENARIOS.map((s) => (
        <view key={s.id} className="home-row">
          <text className="home-label" textContent={s.title} />
          {SIZES.map((size) => (
            <text key={size} className="home-btn" textContent={size} onTap={() => controller.show(s.id, size)} />
          ))}
        </view>
      ))}
    </view>
  );
}
