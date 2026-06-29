"use client";

import { useState, useCallback } from "react";
import Navbar        from "@/components/Navbar";
import Hero          from "@/components/Hero";
import Services      from "@/components/Services";
import Benefits      from "@/components/Benefits";
import Calculator    from "@/components/Calculator";
import Cases         from "@/components/Cases";
import Testimonials  from "@/components/Testimonials";
import Faq           from "@/components/Faq";
import LeadFormSection from "@/components/LeadFormSection";
import LeadModal     from "@/components/LeadModal";
import Footer        from "@/components/Footer";

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal  = useCallback(() => setIsModalOpen(true),  []);
  const closeModal = useCallback(() => setIsModalOpen(false), []);

  return (
    <>
      <Navbar onOpenModal={openModal} />

      <main>
        <Hero          onOpenModal={openModal} />
        <Services />
        <Benefits />
        <Calculator />
        <Cases />
        <Testimonials />
        <Faq />
        <LeadFormSection />
      </main>

      <Footer />

      <LeadModal isOpen={isModalOpen} onClose={closeModal} />
    </>
  );
}
