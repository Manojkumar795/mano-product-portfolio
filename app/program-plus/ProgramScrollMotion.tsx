"use client";

import { useEffect } from "react";

export default function ProgramScrollMotion() {
  useEffect(() => {
    const mockups = Array.from(
      document.querySelectorAll<HTMLElement>(".program-case .pp-workflows .pp-screen"),
    );
    const cleanups: Array<() => void> = [];
    const observers: IntersectionObserver[] = [];

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-in-view");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.14, rootMargin: "0px 0px -7%" },
    );
    observers.push(observer);

    mockups.forEach((mockup, index) => {
      mockup.classList.add("pp-mockup-motion");
      mockup.style.setProperty("--pp-mockup-delay", `${(index % 2) * 100}ms`);
      observer.observe(mockup);

      const media = mockup.querySelector<HTMLElement>(".pp-screen-media");
      if (!media) return;

      const handlePointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const bounds = mockup.getBoundingClientRect();
        const x = (event.clientX - bounds.left) / bounds.width;
        const y = (event.clientY - bounds.top) / bounds.height;
        media.style.setProperty("--pp-mockup-rx", `${(0.5 - y) * 2.6}deg`);
        media.style.setProperty("--pp-mockup-ry", `${(x - 0.5) * 3.2}deg`);
        media.style.setProperty("--pp-mockup-light-x", `${x * 100}%`);
        media.style.setProperty("--pp-mockup-light-y", `${y * 100}%`);
      };

      const resetPointer = () => {
        media.style.setProperty("--pp-mockup-rx", "0deg");
        media.style.setProperty("--pp-mockup-ry", "0deg");
      };

      mockup.addEventListener("pointermove", handlePointerMove);
      mockup.addEventListener("pointerleave", resetPointer);
      cleanups.push(() => {
        mockup.removeEventListener("pointermove", handlePointerMove);
        mockup.removeEventListener("pointerleave", resetPointer);
      });
    });

    const reflection = document.querySelector<HTMLElement>(
      ".program-case .pp-reflection",
    );

    if (reflection) {
      reflection.classList.add("pp-reflection-motion", "motion-ready");

      const kicker = reflection.querySelector<HTMLElement>(".pp-section-kicker");
      const heading = reflection.querySelector<HTMLElement>(".pp-reflection-head");
      const decks = Array.from(
        reflection.querySelectorAll<HTMLElement>(".pp-reflection-deck"),
      );
      const measurement = reflection.querySelector<HTMLElement>(".pp-measurement");
      const revealNodes = [kicker, heading, ...decks, measurement].filter(
        (node): node is HTMLElement => Boolean(node),
      );

      revealNodes.forEach((node, index) => {
        node.classList.add("pp-reflection-reveal");
        node.style.setProperty("--pp-reflection-order", `${Math.min(index, 3)}`);
      });

      decks.forEach((deck, deckIndex) => {
        deck.style.setProperty("--pp-reveal-x", deckIndex === 0 ? "-30px" : "30px");
      });

      const cards = Array.from(
        reflection.querySelectorAll<HTMLElement>(
          ".pp-strength-grid article, .pp-improvement-grid article",
        ),
      );

      cards.forEach((card, index) => {
        const orderWithinDeck = index % Math.max(1, cards.length / Math.max(1, decks.length));
        card.classList.add("pp-reflection-reveal", "pp-reflection-card-motion");
        card.style.setProperty("--pp-reflection-order", `${3 + orderWithinDeck}`);

        const handleCardPointerMove = (event: PointerEvent) => {
          if (event.pointerType === "touch") return;

          const bounds = card.getBoundingClientRect();
          const x = (event.clientX - bounds.left) / bounds.width;
          const y = (event.clientY - bounds.top) / bounds.height;
          card.style.setProperty("--pp-card-x", `${x * 100}%`);
          card.style.setProperty("--pp-card-y", `${y * 100}%`);
          card.style.setProperty("--pp-card-rx", `${(0.5 - y) * 5.5}deg`);
          card.style.setProperty("--pp-card-ry", `${(x - 0.5) * 6.5}deg`);
        };

        const resetCardPointer = () => {
          card.style.setProperty("--pp-card-rx", "0deg");
          card.style.setProperty("--pp-card-ry", "0deg");
        };

        card.addEventListener("pointermove", handleCardPointerMove);
        card.addEventListener("pointerleave", resetCardPointer);
        cleanups.push(() => {
          card.removeEventListener("pointermove", handleCardPointerMove);
          card.removeEventListener("pointerleave", resetCardPointer);
        });
      });

      const handleReflectionPointerMove = (event: PointerEvent) => {
        if (event.pointerType === "touch") return;

        const bounds = reflection.getBoundingClientRect();
        reflection.style.setProperty(
          "--pp-reflection-light-x",
          `${event.clientX - bounds.left}px`,
        );
        reflection.style.setProperty(
          "--pp-reflection-light-y",
          `${event.clientY - bounds.top}px`,
        );
      };

      reflection.addEventListener("pointermove", handleReflectionPointerMove);
      cleanups.push(() =>
        reflection.removeEventListener("pointermove", handleReflectionPointerMove),
      );

      if ("IntersectionObserver" in window) {
        const reflectionObserver = new IntersectionObserver(
          ([entry]) => {
            if (entry.isIntersecting) {
              reflection.classList.add("is-visible");
              reflectionObserver.disconnect();
            }
          },
          { threshold: 0.1, rootMargin: "0px 0px -7%" },
        );
        reflectionObserver.observe(reflection);
        observers.push(reflectionObserver);
      } else {
        reflection.classList.add("is-visible");
      }

      cleanups.push(() => {
        reflection.classList.remove("pp-reflection-motion", "motion-ready", "is-visible");
        revealNodes.forEach((node) => node.classList.remove("pp-reflection-reveal"));
        cards.forEach((card) =>
          card.classList.remove("pp-reflection-reveal", "pp-reflection-card-motion"),
        );
      });
    }

    const addEditorialReveal = (
      sectionSelector: string,
      itemSelector: string,
      visibleClass: string,
      delayStep: number,
    ) => {
      const section = document.querySelector<HTMLElement>(sectionSelector);
      if (!section) return;

      const items = Array.from(section.querySelectorAll<HTMLElement>(itemSelector));
      section.classList.add("motion-ready");
      items.forEach((item, index) => {
        item.style.setProperty("--pp-system-delay", `${index * delayStep}ms`);
      });

      const sectionObserver = new IntersectionObserver(
        ([entry]) => {
          if (entry.isIntersecting) {
            section.classList.add(visibleClass);
            sectionObserver.disconnect();
          }
        },
        { threshold: 0.16, rootMargin: "0px 0px -8%" },
      );

      sectionObserver.observe(section);
      observers.push(sectionObserver);
      cleanups.push(() => {
        section.classList.remove("motion-ready", visibleClass);
        items.forEach((item) => item.style.removeProperty("--pp-system-delay"));
      });
    };

    addEditorialReveal(
      ".program-case .pp-system-practice",
      ".pp-practice-row",
      "is-visible",
      130,
    );
    addEditorialReveal(
      ".program-case .pp-measurement",
      ".pp-measurement-signal",
      "is-measurement-visible",
      120,
    );

    return () => {
      observers.forEach((activeObserver) => activeObserver.disconnect());
      cleanups.forEach((cleanup) => cleanup());
    };
  }, []);

  return null;
}
