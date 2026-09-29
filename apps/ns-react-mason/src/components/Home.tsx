import { SCENARIOS, SIZES } from '../shared/scenarios';
import { controller } from '../store';

export function Home() {
  return (
    <stacklayout className="home">
      <label className="home-title" text="xplat-benchmarks · NativeScript React + Mason" />
      {SCENARIOS.map((s) => (
        <gridlayout key={s.id} className="home-row" columns="*,auto,auto,auto">
          <label className="home-label" text={s.title} />
          {SIZES.map((size, i) => (
            <label key={size} className="home-btn" col={i + 1} text={size} onTap={() => controller.show(s.id, size)} />
          ))}
        </gridlayout>
      ))}
    </stacklayout>
  );
}
