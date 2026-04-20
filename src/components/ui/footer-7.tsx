/**
 * Footer7 - Premium Navigation Footer
 * Adapted for DammyLive F1 Dashboard — with logo image
 */

import React from "react";

interface Footer7Props {
  logo?: {
    url: string;
    component: React.ReactNode;
    title: string;
  };
  sections?: Array<{
    title: string;
    links: Array<{ name: string; href: string }>;
  }>;
  description?: string;
  socialLinks?: Array<{
    icon: React.ReactElement;
    href: string;
    label: string;
  }>;
  copyright?: string;
  legalLinks?: Array<{
    name: string;
    href: string;
  }>;
}

const defaultSections = [
  {
    title: "Championship",
    links: [
      { name: "Race Schedule", href: "/schedule" },
      { name: "Driver Standings", href: "/standings" },
      { name: "Team Standings", href: "/standings" },
      { name: "Circuit Gallery", href: "/circuits" },
    ],
  },
  {
    title: "System",
    links: [
      { name: "Live Engine", href: "/live" },
      { name: "Archive Search", href: "/schedule" },
      { name: "Security Portal", href: "/auth" },
      { name: "Network Status", href: "#" },
    ],
  },
  {
    title: "Resources",
    links: [
      { name: "Technical Specs", href: "#" },
      { name: "Protocol 77", href: "#" },
      { name: "Data Policy", href: "#" },
      { name: "Contact Hub", href: "#" },
    ],
  },
];

const defaultLegalLinks = [
  { name: "Terms and Conditions", href: "#" },
  { name: "Privacy Policy", href: "#" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    component: (
      <div className="flex items-center gap-2">
        <img src="/logo.png" alt="DammyLive" className="w-8 h-8 sm:w-10 sm:h-10 object-contain" />
        <span className="text-xl sm:text-2xl font-black italic tracking-tighter text-text-primary uppercase">
          Dammy<span className="text-f1-red">Live</span>
        </span>
      </div>
    ),
    title: "DammyLive Telemetry",
  },
  sections = defaultSections,
  description = "A professional-grade telemetry platform for the 2026 Formula 1 Season. Delivering precision data and real-time insights.",
  copyright = "© 2026 DammyLive Telemetry Hub. All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <section className="py-12 sm:py-16 lg:py-24 border-t border-border bg-white">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex w-full flex-col justify-between gap-10 lg:flex-row lg:items-start lg:text-left">
          <div className="flex w-full flex-col justify-between gap-6 lg:items-start lg:max-w-xs">
            {/* Logo */}
            <div className="flex items-center gap-2 lg:justify-start">
              <a href={logo.url}>
                {logo.component}
              </a>
            </div>
            <p className="text-xs sm:text-sm text-text-muted font-medium leading-relaxed uppercase tracking-wide">
              {description}
            </p>
          </div>
          <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-6 lg:gap-12 xl:gap-20">
            {sections.map((section, sectionIdx) => (
              <div key={sectionIdx}>
                <h3 className="mb-3 sm:mb-4 text-[10px] font-black uppercase tracking-[0.3em] text-text-primary underline decoration-f1-red underline-offset-8 decoration-2">
                  {section.title}
                </h3>
                <ul className="space-y-2 sm:space-y-3 text-sm text-text-muted">
                  {section.links.map((link, linkIdx) => (
                    <li
                      key={linkIdx}
                      className="font-bold uppercase tracking-tighter text-[10px] sm:text-xs hover:text-f1-red transition-colors"
                    >
                      <a href={link.href}>{link.name}</a>
                    </li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
        <div className="mt-10 sm:mt-16 flex flex-col justify-between gap-4 border-t border-border pt-8 sm:pt-12 text-[9px] sm:text-[10px] font-black uppercase tracking-[0.2em] text-text-muted md:flex-row md:items-center md:text-left">
          <p className="order-2 lg:order-1">{copyright}</p>
          <ul className="order-1 flex flex-col gap-4 md:order-2 md:flex-row md:gap-8">
            {legalLinks.map((link, idx) => (
              <li key={idx} className="hover:text-f1-red transition-colors">
                <a href={link.href}> {link.name}</a>
              </li>
            ))}
          </ul>
        </div>
      </div>
    </section>
  );
};
