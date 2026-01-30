"use client";

import { useEffect, useState, useRef } from "react";
import { Moon, SunDim } from "@phosphor-icons/react";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(true);
  const [mounted, setMounted] = useState(false);
  const iconRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setMounted(true);
    setIsDark(document.documentElement.classList.contains("dark"));
  }, []);

  const toggleTheme = () => {
    const newIsDark = !isDark;

    if (document.startViewTransition && iconRef.current) {
      iconRef.current.classList.add("theme-toggle-transitioning");
      const transition = document.startViewTransition(() => {
        setIsDark(newIsDark);
        if (newIsDark) {
          document.documentElement.classList.add("dark");
          localStorage.setItem("theme", "dark");
        } else {
          document.documentElement.classList.remove("dark");
          localStorage.setItem("theme", "light");
        }
      });
      transition.finished.then(() => {
        iconRef.current?.classList.remove("theme-toggle-transitioning");
      });
    } else {
      setIsDark(newIsDark);
      if (newIsDark) {
        document.documentElement.classList.add("dark");
        localStorage.setItem("theme", "dark");
      } else {
        document.documentElement.classList.remove("dark");
        localStorage.setItem("theme", "light");
      }
    }
  };

  if (!mounted) return null;

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-6 right-6 p-3 cursor-pointer z-50 text-foreground"
      aria-label={isDark ? "Switch to light mode" : "Switch to dark mode"}
    >
      <div ref={iconRef} className="theme-toggle-icon">
        {isDark ? (
          <SunDim size={22} weight="fill" className="scale-125" />
        ) : (
          <Moon size={22} weight="fill" />
        )}
      </div>
    </button>
  );
}
