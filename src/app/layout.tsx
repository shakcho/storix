import type { Metadata } from 'next'
import { 
  Josefin_Sans, 
  Lato, 
  Lustria,
  Playfair_Display, 
  Space_Grotesk, 
  Epilogue, 
  EB_Garamond,
  Cinzel,
  Libre_Baskerville
} from 'next/font/google'
import './globals.css'
import { ClerkProvider } from '@clerk/nextjs'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/toaster'
import { QueryProvider } from '@/lib/query-client'
import { FontProvider } from '@/contexts/font-context'

const josefinSans = Josefin_Sans({ 
  subsets: ['latin'],
  variable: '--font-josefin',
  display: 'swap',
})

// Default application fonts
const lato = Lato({ 
  subsets: ['latin'],
  weight: ['300', '400', '700', '900'],
  variable: '--font-lato',
  display: 'swap',
})

const lustria = Lustria({ 
  subsets: ['latin'],
  weight: ['400'],
  variable: '--font-lustria',
  display: 'swap',
})

const playfairDisplay = Playfair_Display({ 
  subsets: ['latin'],
  variable: '--font-playfair',
  display: 'swap',
})

const spaceGrotesk = Space_Grotesk({ 
  subsets: ['latin'],
  variable: '--font-grotesk',
  display: 'swap',
})

const epilogue = Epilogue({ 
  subsets: ['latin'],
  variable: '--font-epilogue',
  display: 'swap',
})

const ebGaramond = EB_Garamond({ 
  subsets: ['latin'],
  variable: '--font-garamond',
  display: 'swap',
})

// Using Cinzel as an alternative to Stardom (elegant serif display font)
const stardom = Cinzel({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-stardom',
  display: 'swap',
})

// Using Libre Baskerville as an alternative to Melodrama (dramatic serif)
const melodrama = Libre_Baskerville({ 
  subsets: ['latin'],
  weight: ['400', '700'],
  variable: '--font-melodrama',
  display: 'swap',
})

export const metadata: Metadata = {
  title: 'Storix - Professional Story Writing Platform',
  description: 'A comprehensive platform for professional and hobbyist writers to create, collaborate, and publish their stories.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider
      signInUrl="/sign-in"
      signUpUrl="/sign-up"
      afterSignInUrl="/dashboard"
      afterSignUpUrl="/dashboard"
    >
      <html lang="en" suppressHydrationWarning>
        <body 
          className={`font-lato ${josefinSans.variable} ${lato.variable} ${lustria.variable} ${playfairDisplay.variable} ${spaceGrotesk.variable} ${epilogue.variable} ${ebGaramond.variable} ${stardom.variable} ${melodrama.variable}`}
        >
          <QueryProvider>
            <ThemeProvider
              attribute="class"
              defaultTheme="dark"
              enableSystem
              disableTransitionOnChange
            >
              <FontProvider>
                {children}
                <Toaster />
              </FontProvider>
            </ThemeProvider>
          </QueryProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
