import type { ReactNode } from "react";
import type { HowData } from "@/lib/strapi";

const iconOrder = ["design", "integrate", "automate", "govern", "monitor"];

const icons: Record<string, ReactNode> = {
  design: (
    <svg viewBox="0 0 24 24">
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.12 2.12 0 0 1 3 3L7 19l-4 1 1-4Z" />
    </svg>
  ),
  integrate: (
    <svg viewBox="0 0 24 24">
      <circle cx="5" cy="6" r="2.5" />
      <circle cx="19" cy="6" r="2.5" />
      <circle cx="12" cy="18" r="2.5" />
      <path d="M7 7.5 10.5 16" />
      <path d="M17 7.5 13.5 16" />
      <path d="M7.5 6h9" />
    </svg>
  ),
  automate: (
    <svg viewBox="0 0 24 24">
      <path d="M13 2 4 14h7l-1 8 9-12h-7l1-8Z" />
    </svg>
  ),
  govern: (
    <svg viewBox="0 0 24 24">
      <path d="M12 2 4 5v6c0 5 3.5 8.5 8 11 4.5-2.5 8-6 8-11V5l-8-3Z" />
      <path d="m9 11.5 2 2 4-4" />
    </svg>
  ),
  monitor: (
    <svg viewBox="0 0 24 24">
      <path d="M3 3v18h18" />
      <path d="M7 15l3.5-4 3 3L21 7" />
    </svg>
  ),
};

interface HowProps {
  how: HowData | null;
}

const How = ({ how }: HowProps) => {
  if (!how || how.Publish === false) return null;

  const steps = how.capability_items ?? [];

  return (
    <section className="how section-pad" id="how">
      <div className="site-shell">
        <div className="section-head reveal">
          <div>
            <div className="eyebrow">{how.eyebrow?.trim()}</div>
            <h2>{how.main_title?.trim()}</h2>
          </div>
        </div>
        <div className="steps reveal">
          {steps.map((step, i) => {
            const key = step.icon?.trim().toLowerCase() ?? "";
            const icon = icons[key] ?? icons[iconOrder[i]];
            return (
              <article className="step" key={step.id}>
                <span className="step-no">{String(i + 1).padStart(2, "0")}</span>
                <div className="step-icon">{icon}</div>
                <h3>{step.title}</h3>
                <p>{step.description}</p>
                {i < steps.length - 1 && <span className="step-arrow">→</span>}
              </article>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default How;