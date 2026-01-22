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
                Hi, I&apos;m Elia - I&apos;m obsessed with building software that
                performs, scales and solves problems.
              </p>
              <p>
                My love for building things started at age 14, when I launched
                an automated botting panel, processed 100k+ orders and then got
                sued for not being GDPR compliant.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
