import React from "react";
import NavBar from "@/components/navbar";
import Hero from "@/components/hero";
import StatsStrip from "@/components/stats-strip";
import HowItWorks from "@/components/how-it-works";
import Architecture from "@/components/architecture";
import RecentDeploys from "@/components/recent-deploys";
import ClosingCta from "@/components/closing-cta";
import Footer from "@/components/footer";

export default function Home() {
  return (
    <>
      <NavBar />
      <main className="flex-grow">
        <Hero />
        <StatsStrip />
        <HowItWorks />
        <Architecture />
        <RecentDeploys />
        <ClosingCta />
      </main>
      <Footer />
    </>
  );
}
