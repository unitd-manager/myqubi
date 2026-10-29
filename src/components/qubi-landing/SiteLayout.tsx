import { useEffect, useState } from "react";
import { Outlet } from "react-router-dom";
import "./qubi-landing.css";
import Nav from "./Nav";
import QubiFooter from "./QubiFooter";
import VideoModal from "./VideoModal";
import {
  getHeader,
  getFooter,
  getHero,
  type HeaderData,
  type FooterData,
  type HeroData,
} from "@/lib/strapi";

const SiteLayout = () => {
  const [header, setHeader] = useState<HeaderData | null>(null);
  const [footer, setFooter] = useState<FooterData | null>(null);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [videoOpen, setVideoOpen] = useState(false);

  useEffect(() => {
    getHeader()
      .then((d) => setHeader(d ?? null))
      .catch((e) => console.error("header error", e));
    getFooter()
      .then((d) => setFooter(d ?? null))
      .catch((e) => console.error("footer error", e));
    getHero()
      .then((d) => setHero(d ?? null))
      .catch((e) => console.error("hero error", e));
  }, []);

  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => setVideoOpen(false);

  return (
    <div className="qubi-landing">
      <Nav header={header} onOpenVideo={openVideo} />
      <Outlet context={{ openVideo }} />
      <QubiFooter footer={footer} />
      <VideoModal
        open={videoOpen}
        onClose={closeVideo}
        src={hero?.secondary_button?.url}
        title={hero?.video_modal_title}
      />
    </div>
  );
};

export default SiteLayout;