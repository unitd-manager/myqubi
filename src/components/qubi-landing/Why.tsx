import type { ProblemData } from "@/lib/strapi";

interface WhyProps {
  problem?: ProblemData | null;
}

const Why = ({ problem }: WhyProps) => {
  if (!problem || problem.Publish === false) return null;

  const items = problem.problem_items ?? [];
  const cards = problem.outcome_cards ?? [];

  return (
    <section className="why section-pad" id="why">
      <div className="site-shell">
        <div className="manifesto-grid">
          {/* LEFT */}
          <div className="manifesto-sticky reveal">
            {problem.eyebrow && <div className="eyebrow">{problem.eyebrow}</div>}

            <h2>
              {problem.main_title}{" "}
              {problem.title_highlight && <em>{problem.title_highlight}</em>}
            </h2>

            {problem.description && <p>{problem.description}</p>}

            {cards.length > 0 && (
              <div className="outcome-ribbon">
                {cards.map((card) => (
                  <div className="outcome-card" key={card.id}>
                    <strong>{card.title}</strong>
                    <span>{card.description}</span>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* RIGHT */}
          <div className="manifesto-lines reveal">
            {items.map((item, i) => (
              <div
                className={`manifesto-line${
                  i === items.length - 1 ? " highlight" : ""
                }`}
                key={item.id}
              >
                <div className="num">{String(i + 1).padStart(2, "0")}</div>
                <h3>{item.title}</h3>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;