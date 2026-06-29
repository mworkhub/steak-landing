"use client";

import { useEffect } from "react";

export default function ScrollObserver() {
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (!entry.isIntersecting) return;
          const el = entry.target as HTMLElement;
          const delay = el.dataset.delay ? parseInt(el.dataset.delay, 10) : 0;
          setTimeout(() => el.classList.add("is-visible"), delay);
          io.unobserve(el);
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -48px 0px" }
    );

    function observeNew() {
      document.querySelectorAll<HTMLElement>("[data-reveal]:not(.is-visible)").forEach((el) =>
        io.observe(el)
      );
    }

    observeNew();

    // Re-observe when Client Components add new [data-reveal] elements (e.g. after DB fetch)
    let timer: ReturnType<typeof setTimeout>;
    const mo = new MutationObserver(() => {
      clearTimeout(timer);
      timer = setTimeout(observeNew, 50);
    });
    mo.observe(document.body, { subtree: true, childList: true });

    return () => { io.disconnect(); mo.disconnect(); clearTimeout(timer); };
  }, []);

  return null;
}
