"use client";

import { useEffect, useState } from "react";
import BackLink from "@/components/BackLink";

export default function AboutPage() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
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
            className={`space-y-6 transform transition-all duration-700 ease-out ${
              isLoaded ? "translate-y-0 opacity-100" : "translate-y-4 opacity-0"
            }`}
            style={{ transitionDelay: "200ms" }}
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
                views cost 0.0001$/1k at the time). My panel processed 100k+
                orders, was relied on by major industry players - and got me
                sued for not fully being GDPR compliant.
              </p>
              <p>
                Since around that time I've basically spent all my free time
                tinkering with software and hardware (for a while at the time I
                also built, sold and repaired desktop PCs).
              </p>
              <p>
                I love to dive deep into anything really, never give up on
                finding solutions (sometimes sacrificing sleep) - and my
                dopamine spikes when seeing traffic hitting infrastructures,
                seeing performance optimizations take effect, or processes
                clicking seamlessly.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
