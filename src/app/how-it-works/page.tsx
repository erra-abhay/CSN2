"use client";

import React from "react";
import NavBar from "@/components/navbar";
import Footer from "@/components/footer";
import HowItWorks from "@/components/how-it-works";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function HowItWorksPage() {
  return (
    <>
      <NavBar />
      <main className="bg-[#FAF9F6] min-h-screen text-neutral-800 font-sans pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-6 mb-6">
          {/* Back link */}
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm font-semibold text-neutral-500 hover:text-accent transition-colors group"
          >
            <ArrowLeft size={16} className="group-hover:-translate-x-1 transition-transform" />
            Back to homepage
          </Link>
        </div>
        <HowItWorks />
      </main>
      <Footer />
    </>
  );
}
