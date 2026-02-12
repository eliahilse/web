"use client";

import { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";
import { calculateAge, LOCATION } from "@/lib/config";
import { ArrowSquareOut } from "@phosphor-icons/react";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);
  const [age, setAge] = useState(calculateAge);

  useEffect(() => {
    setIsLoaded(true);
    const interval = setInterval(() => {
      setAge(calculateAge());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-8 pb-32">
      <div className="flex-1">
        <div className="page-container">
          <div
            className={`mb-12 transform transition-all duration-700 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "100ms" }}
          >
            <BackLink href="/" label="Back to home" />
            <h1 className="text-4xl font-bold text-foreground mb-4 page-heading">
              About
            </h1>
          </div>

          <div
            className={`mb-8 flex flex-col sm:flex-row sm:gap-8 gap-2 text-sm text-muted-foreground font-mono transform transition-all duration-700 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "150ms" }}
          >
            <div>
              <span className="text-foreground/60">age:</span>{" "}
              {age.years}y {age.days}d {age.seconds.toLocaleString("en-US")}s
            </div>
            <div>
              <span className="text-foreground/60">location:</span> {LOCATION}
            </div>
            <div>
              <a href="https://raw.githubusercontent.com/eliahilse/cv/main/cv.pdf" target="_blank" rel="noopener noreferrer" className="hover:text-foreground transition-colors">
                <span className="text-foreground/60">cv:</span> pdf <ArrowSquareOut className="inline-block ml-0.5 -mt-0.5" size={12} />
              </a>
            </div>
          </div>

          <div
            className={`space-y-6 transform transition-all duration-700 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "250ms" }}
          >
            <div className="prose dark:prose-invert max-w-none text-lg text-muted-foreground">
              <p className="">
                Hi, I&apos;m Elia - I&apos;m obsessed with building software
                that performs, scales and solves problems.
              </p>
              <p>
                My love for building things started at age 14, when I launched
                an automated botting panel (instant followers, likes and views
                from the best farms during the renaissance of botting - TikTok
                views cost 0.0003$/1k at the time). My panel processed 100k+
                orders, was relied on by major industry players - got me sued
                for not fully being GDPR compliant - and also got me into
                trouble when the school&apos;s AV flagged a YouTube Livestream
                Viewer script I wrote being present on one of my USB sticks.
              </p>
              <p>
                Since around that time I&apos;ve basically spent most of my free
                time tinkering with software and hardware (for a while at the
                time I also built, sold and repaired desktop PCs - also soldered
                a bunch).
              </p>
              <p>
                Towards the end of my time at the Gymnasium (German high-school
                equivalent) I started my first (tech-wise) more proper project,
                Eternity, which began with a Discord bot solving a problem
                (renting out NFTs in a crypto game), that then spiralled into a
                multi-modal platform forming basically a monopoly on the rental
                market. Out of fun I also assembled an E-Sports team of the best
                players in the community that formed around the tool, that then
                went on dominating in various web3 tournaments for about a year.
                We even hit a LAN in Istanbul, Turkey.
              </p>
              <p>
                In parallel I took my proceeds of my casino arbitrage operation
                (see side projects), and deployed part of the capital in DeFi
                across basically all major protocols and chains (on avg yielding
                ~30% APR) - things with quantifiable optimization potential are
                just fun to me, using only few understand adds extra to it.
                Since I got my whoop I also started optimizing health (exercise,
                movement, sleep) for similar reasons.
              </p>
              <p>
                After securing my scholarship post-graduation and starting my
                studies, I got offered to work for a local property developer
                (mid-size, $30M AUM) that had some existing digital projects and
                wanted to spin up further ventures - my role started as
                engineering lead on a project, then gradually got extended until
                I took care of everything technical as CTO.
              </p>
              <p>
                On the side I also did 95% of my CS bachelors (thesis this
                year), basically only showing up to exams w/ avg prep time of
                ~12h.
              </p>
              <p>
                Beyond technical things I from time to time enjoy games (e.g.{" "}
                <i>Civilization</i> or <i>Cities: Skylines</i>), read light
                crime (e.g. Doyle&apos;s Sherlock Holmes) or thrillers (have a
                weakness for books from Poznanski and Eschbach), and rarely also
                consume high-quality visual content.
              </p>
              <p>
                I get dopamine spikes from closing open ends, optimizing
                (anything), seeing load hitting infrastructure, processes
                clicking seamlessly, and observing highly performant systems.
                Sometimes I also dream about building things (or have nightmares
                about fictive 3rd order effects / bugs).
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
