/**
 * Footer7 — Luxury Editorial Footer
 * Generous spacing, serif headings, minimal lines
 */

import React from "react";
import { RacingLine } from "../shared/RacingLine";

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
    title: "Drivers Websites",
    links: [
      { name: "Official F1 Drivers", href: "https://www.formula1.com/en/drivers.html" },
      { name: "Lewis Hamilton", href: "https://www.lewishamilton.com/" },
      { name: "Max Verstappen", href: "https://www.verstappen.com/"},
      { name: "Charles Leclerc", href: "https://charlesleclerc.com/en/" },
      { name: "Lando Norris", href: "https://www.landonorris.com/" },
      { name: "Gabriel Bortoleto", href: "https://www.gabrielbortoleto.com.br/en/" },
      { name: "Oscar Piastri", href: "https://www.oscarpiastri.com/" },
      { name: "Isack Hadjar", href: "https://www.isackhadjar.com/" },
      { name: "Pierre Gasly", href: "https://www.pierregasly.com/" },
      { name: "Sergio Perez", href: "https://www.checoperez.com/" },
      { name: "Fernando Alonso", href: "https://www.fernandoalonso.com/" },
      { name: "Valtteri Bottas", href: "https://www.vbexperience.com/" },
      { name: "Lance Stroll", href: "https://www.lancestroll.com/" },
      { name: "Alex Albon", href: "https://www.alexalbon.com/" },
      { name: "Nico Hülkenberg", href: "https://www.nicohulkenberg.net/" },
      { name: "Esteban Ocon", href: "https://www.esteban-ocon.com" },
      { name: "Franco Colapinto", href: "https://www.francolapinto.com/" },
      { name: "Carlos Sainz", href: "https://carlossainz.es/en/" },
      { name: "Ollie Bearman", href: "https://www.olliebearman.com/" },
    ],
  },
  {
    title: "Constructors Websites",
    links: [
      { name: "Official F1 Teams", href: "https://www.formula1.com/en/teams.html" },
      { name: "Mercedes-AMG F1", href: "https://www.mercedesamgf1.com/" },
      { name: "Red Bull Racing", href: "https://www.redbullracing.com/" },
      { name: "Scuderia Ferrari", href: "https://www.ferrari.com/en-EN/formula1" },
      { name: "McLaren F1 Team", href: "https://www.mclaren.com/racing/" },
      { name: "Alpine F1 Team", href: "https://www.alpinef1.com/" },
      { name: "Aston Martin Aramco Cognizant F1 Team", href: "https://www.astonmartinf1.com/" },
      { name: "Williams Racing", href: "https://www.williamsf1.com/"},
      { name: "Racing Bulls F1 Team", href: "https://www.visacashapprb.com/" },
      { name: "Haas F1 Team", href: "https://www.haasf1team.com/" },
      { name: "Audi Revolut F1® Team", href: "https://www.audi.com/en/sport/motorsport/formula-1/" },
      { name: "Cadillac F1 Team", href: "https://www.cadillacf1team.com/" },
      { name: "Team Standings", href: "/standings" },
      { name: "Constructor History", href: "#" },
      { name: "Team Profiles", href: "#" },
    ],
  },
];

const defaultLegalLinks = [
  { name: "Terms", href: "/terms" },
  { name: "Privacy", href: "/privacy" },
];

export const Footer7 = ({
  logo = {
    url: "/",
    component: (
      <div className="flex items-center gap-3">
        <img src="/logo.png" alt="DammyLive" className="w-8 h-8 object-contain grayscale" />
        <span className="font-serif text-xl text-[#1A1A1A] tracking-tight">
          Dammy<em className="text-[#D4AF37]">Live</em>
        </span>
      </div>
    ),
    title: "DammyLive Editorial",
  },
  sections = defaultSections,
  description = "A curated editorial platform for the 2026 Formula 1 Season. Precision data and considered insights.",
  copyright = "© 2026 DammyLive.All rights reserved.",
  legalLinks = defaultLegalLinks,
}: Footer7Props) => {
  return (
    <>
      <div className="mt-12 md:mt-24 w-full bg-[#F9F8F6] pt-10">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16 flex items-center">
          <img src="/F1.svg.png" alt="F1 Logo" className="h-5 md:h-7 lg:h-8 shrink-0 mr-4 md:mr-6 object-contain" />
          <RacingLine className="flex-grow" />
        </div>
      </div>
      <section className="py-20 md:py-32 bg-[#F9F8F6]">
        <div className="max-w-[1600px] mx-auto px-8 md:px-16">
          <div className="flex w-full flex-col justify-between gap-16 lg:flex-row lg:items-start">
            {/* Brand Column */}
            <div className="flex w-full flex-col justify-between gap-8 lg:items-start lg:max-w-sm">
              <a href={logo.url}>
                {logo.component}
              </a>
              <p className="font-sans text-sm text-[#6C6863] leading-relaxed max-w-xs">
                {description}
              </p>
              {/* Decorative line */}
              <div className="h-px w-12 bg-[#D4AF37]" />
            </div>

            {/* Navigation Columns */}
            <div className="grid w-full grid-cols-2 sm:grid-cols-3 gap-12 lg:gap-20">
              {sections.map((section, sectionIdx) => (
                <div key={sectionIdx}>
                  <h3 className="font-serif text-base text-[#1A1A1A] mb-6 pb-3 border-b border-[#1A1A1A]/10">
                    {section.title}
                  </h3>
                  <ul className="space-y-3">
                    {section.links.map((link, linkIdx) => (
                      <li key={linkIdx}>
                        <a
                          href={link.href}
                          target={link.href.startsWith('http') ? '_blank' : undefined}
                          rel={link.href.startsWith('http') ? 'noopener noreferrer' : undefined}
                          className="font-sans text-xs font-medium text-[#6C6863] hover:text-[#D4AF37] transition-colors duration-500 uppercase tracking-[0.15em]"
                        >
                          {link.name}
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          </div>

          {/* Bottom bar */}
          <div className="mt-20 flex flex-col justify-between gap-4 border-t border-[#1A1A1A]/10 pt-10 font-sans text-[10px] font-medium uppercase tracking-[0.2em] text-[#6C6863] md:flex-row md:items-center">
            <p className="order-2 lg:order-1">{copyright}</p>
            <ul className="order-1 flex flex-col gap-4 md:order-2 md:flex-row md:gap-8">
              {legalLinks.map((link, idx) => (
                <li key={idx} className="hover:text-[#D4AF37] transition-colors duration-500">
                  <a href={link.href}>{link.name}</a>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>
    </>
  );
};
