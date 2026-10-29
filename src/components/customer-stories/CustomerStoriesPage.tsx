import { useEffect, useState } from "react";
import "./CustomerStories.css";
import Hero from "./Hero";
import StoryExplorer from "./StoryExplorer";
import WhyQubi from "./WhyQubi";
import Cta from "./Cta";
import { getCustomersPage, type CustomersData } from "@/lib/strapi";

export default function CustomerStoriesPage() {
  const [data, setData] = useState<CustomersData>({});

  useEffect(() => {
    getCustomersPage().then(setData).catch(console.error);
  }, []);

  const on = (b?: { Publish?: boolean | null }) => b && b.Publish !== false;

  return (
    <div className="customer-stories-page">
      <main>
        {on(data.hero) && <Hero hero={data.hero!} stats={data.stats} />}
        {on(data.stories) && <StoryExplorer data={data.stories!} />}
        {(on(data.why) || on(data.story)) && (
          <WhyQubi why={data.why} story={data.story} />
        )}
        {on(data.cta) && <Cta cta={data.cta!} />}
      </main>
    </div>
  );
}