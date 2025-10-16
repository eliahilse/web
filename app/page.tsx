'use client';

import React, { useEffect, useState } from 'react';
import { SiGithub, SiX } from '@icons-pack/react-simple-icons';
import Link from 'next/link';

export default function Home() {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    setIsLoaded(true);
  }, []);

  const socialLinks = [
    { type: 'custom' as const, src: '/img/linkedin.svg', href: 'https://www.linkedin.com/in/eliahilse', label: 'LinkedIn' },
    { type: 'icon' as const, icon: SiGithub, href: 'https://github.com/eliahilse', label: 'GitHub' },
    { type: 'icon' as const, icon: SiX, href: 'https://x.com/eliahilse', label: 'X' },
  ];

  const categories = [
    { name: 'work', href: '#' },
    { name: 'side projects', href: '/side-projects' },
    { name: 'competitions', href: '/competitions' },
    { name: 'research', href: '/research' },
    { name: 'blog', href: '/blog' }
  ];

  return (
    <div className="min-h-screen flex flex-col justify-between p-8">
      <div className="flex-1 flex flex-col items-center justify-center">
        <div className="max-w-2xl mx-auto text-center flex flex-col">
          {/* Name */}
          <div 
            className={`transform transition-all duration-700 ease-out ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '100ms' }}
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Elia Hilse
            </h1>
          </div>

          {/* Subtitle */}
          <div 
            className={`transform transition-all duration-700 ease-out mb-12 ${
              isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
            }`}
            style={{ transitionDelay: '200ms' }}
          >
            <p className="text-lg text-muted-foreground">
              Principal Software Engineer & Tech Lover
            </p>
          </div>

          {/* Categories */}
          <div className="flex flex-col gap-4 max-w-md">
            {categories.map((category, index) => (
              <div
                key={category.name}
                className={`transform transition-all duration-700 ease-out ${
                  isLoaded ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'
                }`}
                style={{ transitionDelay: `${300 + index * 50}ms` }}
              >
                <Link
                  href={category.href}
                  className="group w-full bg-white/7 border border-white/12 hover:border-white/20 hover:bg-white/9 transition-colors duration-200 rounded-md px-4 py-2 flex items-center justify-between"
                >
                  <span className="text-foreground font-medium">
                    {category.name}
                  </span>
                  <span className="bg-white/10 text-foreground/70 text-xs px-3 py-1 rounded-full inline-flex items-center gap-1">
                    {category.href === '#' ? 'coming soon' : (
                      <>
                        <span className="sr-only">open</span>
                        <span className="inline-block transform transition-transform duration-200 group-hover:translate-x-0.5">→</span>
                      </>
                    )}
                  </span>
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Social Icons at Bottom */}
      <div className="flex justify-center space-x-6 pb-8">
        {socialLinks.map((link, index) => (
          <div
            key={link.label}
            className={`transform transition-all duration-1000 ease-out ${
              isLoaded ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transitionDelay: `${500 + index * 50}ms` }}
          >
            <Link
              href={link.href}
              className="text-foreground p-2"
              aria-label={link.label}
            >
              {link.type === 'custom' ? (
                <img 
                  src={link.src} 
                  alt={link.label} 
                  width={24} 
                  height={24}
                  className="w-6 h-6 filter invert"
                />
              ) : (
                React.createElement(link.icon, { size: 24 })
              )}
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
}
