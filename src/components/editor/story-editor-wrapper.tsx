'use client';

import { useFont } from '@/contexts/font-context';
import { cn } from '@/lib/utils';
import { ReactNode } from 'react';

interface StoryEditorWrapperProps {
  children: ReactNode;
  className?: string;
}

/**
 * Wrapper component that applies user's selected font pairing to story writing pages.
 * Use this to wrap any story/writing content that should respect the font preferences.
 * 
 * The main application UI uses Lustria (titles) + Lato (body) by default.
 * This wrapper applies the selected story font pairing from user preferences.
 */
export function StoryEditorWrapper({ children, className }: StoryEditorWrapperProps) {
  const { titleFont, bodyFont } = useFont();
  
  return (
    <div className={cn(bodyFont, 'story-content', className)}>
      <style jsx global>{`
        .story-content h1,
        .story-content h2,
        .story-content h3,
        .story-content h4,
        .story-content h5,
        .story-content h6 {
          font-family: inherit;
        }
        
        .story-content h1,
        .story-content h2,
        .story-content h3,
        .story-content h4,
        .story-content h5,
        .story-content h6 {
          font-family: ${titleFont === 'font-josefin' ? 'var(--font-josefin)' :
                         titleFont === 'font-playfair' ? 'var(--font-playfair)' :
                         titleFont === 'font-stardom' ? 'var(--font-stardom)' : 
                         'inherit'};
        }
      `}</style>
      {children}
    </div>
  );
}

