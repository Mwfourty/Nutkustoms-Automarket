import { Check } from 'lucide-react';
import { STEPS } from './listingDraft';

interface StepSidebarProps {
  current: number;
  onSelect: (step: number) => void;
}

const StepSidebar = ({ current, onSelect }: StepSidebarProps) => (
  <aside className="w-full rounded-3xl border border-white/8 bg-white/[0.03] p-4 backdrop-blur-xl lg:w-64 lg:shrink-0 lg:self-start lg:p-6 light:border-black/10 light:bg-white/80 light:shadow-sm">
    <div className="flex items-center gap-2 lg:hidden">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <button
            key={step.title}
            type="button"
            aria-label={step.title}
            disabled={index > current}
            onClick={() => onSelect(index)}
            className={`flex h-8 min-w-0 items-center justify-center rounded-full border text-xs font-medium disabled:cursor-default ${
              active
                ? 'flex-[2] border-transparent bg-white px-3 text-black light:bg-neutral-900 light:text-white'
                : done
                  ? 'w-8 shrink-0 border-amber-300/60 text-amber-300 light:text-amber-600'
                  : 'w-8 shrink-0 border-white/15 text-neutral-500 light:border-black/15'
            }`}
          >
            {active ? (
              <span className="truncate">
                {index + 1}. {step.title}
              </span>
            ) : done ? (
              <Check size={14} />
            ) : (
              index + 1
            )}
          </button>
        );
      })}
    </div>
    <p className="hidden font-display text-sm font-semibold uppercase tracking-widest text-neutral-200 lg:block light:text-neutral-900">
      Listing steps
    </p>
    <ol className="mt-6 hidden flex-col gap-5 lg:flex">
      {STEPS.map((step, index) => {
        const done = index < current;
        const active = index === current;
        return (
          <li key={step.title}>
            <button
              type="button"
              disabled={index > current}
              onClick={() => onSelect(index)}
              className="flex w-full items-center gap-3 text-left disabled:cursor-default"
            >
              <span
                className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full border text-xs font-medium ${
                  active
                    ? 'border-transparent bg-white text-black light:bg-neutral-900 light:text-white'
                    : done
                      ? 'border-amber-300/60 text-amber-300 light:text-amber-600'
                      : 'border-white/15 text-neutral-500 light:border-black/15'
                }`}
              >
                {done ? <Check size={14} /> : index + 1}
              </span>
              <span className="flex flex-col">
                <span
                  className={`font-display text-sm ${
                    active
                      ? 'text-white light:text-neutral-900'
                      : 'text-neutral-400 light:text-neutral-500'
                  }`}
                >
                  {step.title}
                </span>
                <span className="text-xs text-neutral-500">{step.subtitle}</span>
              </span>
            </button>
          </li>
        );
      })}
    </ol>
  </aside>
);

export default StepSidebar;
