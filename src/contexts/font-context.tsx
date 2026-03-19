'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';

export type FontPairing = 
  | 'josefin-lato' 
  | 'playfair-grotesk' 
  | 'stardom-epilogue' 
  | 'stardom-garamond' 
  | 'stardom-melodrama';

interface FontContextType {
  fontPairing: FontPairing;
  setFontPairing: (pairing: FontPairing) => void;
  titleFont: string;
  bodyFont: string;
}

const FontContext = createContext<FontContextType | undefined>(undefined);

export const fontPairings = {
  'josefin-lato': {
    title: 'Josefin Sans',
    body: 'Lato',
    titleClass: 'font-josefin',
    bodyClass: 'font-lato',
  },
  'playfair-grotesk': {
    title: 'Playfair Display',
    body: 'Space Grotesk',
    titleClass: 'font-playfair',
    bodyClass: 'font-grotesk',
  },
  'stardom-epilogue': {
    title: 'Stardom',
    body: 'Epilogue',
    titleClass: 'font-stardom',
    bodyClass: 'font-epilogue',
  },
  'stardom-garamond': {
    title: 'Stardom',
    body: 'EB Garamond',
    titleClass: 'font-stardom',
    bodyClass: 'font-garamond',
  },
  'stardom-melodrama': {
    title: 'Stardom',
    body: 'Melodrama',
    titleClass: 'font-stardom',
    bodyClass: 'font-melodrama',
  },
} as const;

export function FontProvider({ children }: { children: React.ReactNode }) {
  const [fontPairing, setFontPairingState] = useState<FontPairing>('josefin-lato');

  useEffect(() => {
    // Load saved font preference
    const saved = localStorage.getItem('font-pairing') as FontPairing;
    if (saved && fontPairings[saved]) {
      setFontPairingState(saved);
    }
  }, []);

  // Note: Font pairing is applied per-component basis for writing pages only
  // Main app uses Lato + Lustria by default

  const setFontPairing = (pairing: FontPairing) => {
    setFontPairingState(pairing);
    localStorage.setItem('font-pairing', pairing);
  };

  const pairing = fontPairings[fontPairing];

  return (
    <FontContext.Provider
      value={{
        fontPairing,
        setFontPairing,
        titleFont: pairing.titleClass,
        bodyFont: pairing.bodyClass,
      }}
    >
      {children}
    </FontContext.Provider>
  );
}

export function useFont() {
  const context = useContext(FontContext);
  if (context === undefined) {
    throw new Error('useFont must be used within a FontProvider');
  }
  return context;
}

