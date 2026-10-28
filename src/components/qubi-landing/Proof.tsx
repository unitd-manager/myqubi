import type { ProofData } from "@/lib/strapi";

interface ProofProps {
  proof: ProofData | null;
}

const Proof = ({ proof }: ProofProps) => {
  if (!proof || proof.Publish === false) return null;

  const stories = proof.features ?? [];
  const storyBtn = proof.featured_button;
  const bridgeBtn = proof.bridge_button;

  return (
    <>
      <section className="proof section-pad" id="customers">
        <div className="site-shell">
          <div className="section-head reveal">
            <div>
              <div className="eyebrow">{proof.eyebrow?.trim()}</div>
              <h2>{proof.main_title?.trim()}</h2>
            </div>
          </div>

          <div className="story-grid reveal">
            <article className="story-main">
              <span className="story-tag">{proof.featured_tag}</span>
              <blockquote>{proof.featured_quote}</blockquote>
              <div className="story-foot">
                <div className="story-metric">
                  <strong>{proof.featured_metric}</strong>
                </div>
                {storyBtn?.label && (
                  <a className="btn btn-light" href={storyBtn.url}>
                    {storyBtn.label}
                  </a>
                )}
              </div>
            </article>

            <div className="story-side">
              {stories.map((story) => (
                <article className="story-card" key={story.id}>
                  <div>
                    <span className="eyebrow">{story.story_label}</span>
                    <h3>{story.title}</h3>
                    <p>{story.description}</p>
                  </div>
                </article>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Powered by qBotica */}
      <div className="cs-bridge">
        <div className="cs-shell">
          <div className="cs-bridge-box">
            <div className="cs-bridge-copy">
              {proof.bridge_logo?.url && (
                <img
                  src={proof.bridge_logo.url}
                  alt={proof.bridge_logo.alternativeText || ""}
                  className="cs-bridge-logo"
                />
              )}
              <div>
                <h3>
                  {proof.bridge_prefix}{" "}
                  <span className="cs-bridge-qbotica-text">
                    {proof.bridge_brand}
                  </span>
                </h3>
                <p>{proof.bridge_description}</p>
              </div>
            </div>
            {bridgeBtn?.label && (
              <a
                className="cs-btn cs-btn-dark"
                href={bridgeBtn.url}
                target="_blank"
                rel="noreferrer"
              >
                {bridgeBtn.label}
              </a>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Proof;