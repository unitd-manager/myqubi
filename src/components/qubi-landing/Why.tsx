import type { ProblemData } from "@/lib/strapi";

interface WhyProps {
  problem: ProblemData | null;
}

const Why = ({ problem }: WhyProps) => {
  if (!problem || problem.Publish === false) return null;

  const items = problem.problem_items ?? [];
  const pad = (n: number) => String(n).padStart(2, "0");

  return (
    <section className="why section-pad" id="why">
      <div className="site-shell">
        <div className="manifesto-grid">
          <div className="manifesto-sticky reveal">
            <div className="eyebrow">{problem.eyebrow?.trim()}</div>
            <h2>
              {problem.main_title?.trim()} <em>{problem.title_highlight}</em>
            </h2>
            <p>{problem.description}</p>

            <div className="outcome-ribbon">
              {problem.outcome_cards?.map((card) => (
                <div className="outcome-card" key={card.id}>
                  <strong>{card.title}</strong>
                  <span>{card.description}</span>
                </div>
              ))}
            </div>
          </div>

          <div className="manifesto-lines reveal">
            {items.map((item, i) => (
              <div className="manifesto-line" key={item.id}>
                <div className="num">{pad(i + 1)}</div>
                <h3>{item.title}</h3>
              </div>
            ))}

            {problem.conclusion_text && (
              <div className="manifesto-line highlight">
                <div className="num">{pad(items.length + 1)}</div>
                <h3>{problem.conclusion_text}</h3>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
};

export default Why;