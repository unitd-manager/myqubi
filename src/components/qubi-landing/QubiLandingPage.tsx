import { useEffect, useRef, useState } from "react";
import "./qubi-landing.css";
import Nav from "./Nav";
import Hero from "./Hero";
import Ticker from "./Ticker";
import Why from "./Why";
import How from "./How";
import UseCases from "./UseCases";
import Enterprise from "./Enterprise";
import Proof from "./Proof";
import Cta from "./Cta";
import QubiFooter from "./QubiFooter";
import VideoModal from "./VideoModal";
import { useReveal } from "./useReveal";
import {
  getHero,
  getProblem,
  getHow,
  getUseCases,
  getEnterprise,
  getProof,
  getCta,
  type HeroData,
  type ProblemData,
  type HowData,
  type UseCasesData,
  type EnterpriseData,
  type ProofData,
  type CtaData,
} from "@/lib/strapi";

const QubiLandingPage = () => {
  const [videoOpen, setVideoOpen] = useState(false);
  const [hero, setHero] = useState<HeroData | null>(null);
  const [problem, setProblem] = useState<ProblemData | null>(null);
  const [how, setHow] = useState<HowData | null>(null);
  const [useCases, setUseCases] = useState<UseCasesData | null>(null);
  const [enterprise, setEnterprise] = useState<EnterpriseData | null>(null);
  const [proof, setProof] = useState<ProofData | null>(null);
  const [cta, setCta] = useState<CtaData | null>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getHero().then((d) => setHero(d ?? null)).catch(console.error);
    getProblem().then((d) => setProblem(d ?? null)).catch(console.error);
    getHow().then((d) => setHow(d ?? null)).catch(console.error);
    getUseCases().then((d) => setUseCases(d ?? null)).catch(console.error);
    getEnterprise().then((d) => setEnterprise(d ?? null)).catch(console.error);
    getProof().then((d) => setProof(d ?? null)).catch(console.error);
    getCta().then((d) => setCta(d ?? null)).catch(console.error);
  }, []);

  useReveal(containerRef, [hero, problem, how, useCases, enterprise, proof, cta]);

  const openVideo = () => setVideoOpen(true);
  const closeVideo = () => setVideoOpen(false);

  return (
    <div className="qubi-landing" ref={containerRef}>
      <Nav onOpenVideo={openVideo} />

      <main id="top">
        <Hero hero={hero} onOpenVideo={openVideo} />
        <Ticker items={hero?.ticker_items} />
        <Why problem={problem} />
        <How how={how} />
        <UseCases useCases={useCases} />
        <Enterprise enterprise={enterprise} onOpenVideo={openVideo} />
        <Proof proof={proof} />
        <Cta cta={cta} onOpenVideo={openVideo} />
      </main>

      <QubiFooter />
      <VideoModal
        open={videoOpen}
        onClose={closeVideo}
        src={hero?.secondary_button?.url}
        title={hero?.video_modal_title}
      />
    </div>
  );
};

export default QubiLandingPage;