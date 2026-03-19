'use client';

import { useState } from 'react';
import { useFont, fontPairings, FontPairing } from '@/contexts/font-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Label } from '@/components/ui/label';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Button } from '@/components/ui/button';
import { useToast } from '@/hooks/use-toast';
import { Check, Sparkles } from 'lucide-react';
import Link from 'next/link';

export default function SettingsPage() {
  const { fontPairing, setFontPairing } = useFont();
  const { toast } = useToast();
  const [selectedPairing, setSelectedPairing] = useState<FontPairing>(fontPairing);

  const handleSave = () => {
    setFontPairing(selectedPairing);
    toast({
      title: 'Font pairing saved!',
      description: `Your font preference has been updated to ${fontPairings[selectedPairing].title} + ${fontPairings[selectedPairing].body}.`,
    });
  };

  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-4xl font-bold mb-2">Settings</h1>
            <p className="text-muted-foreground">
              Customize your writing experience
            </p>
          </div>
          <Link href="/dashboard">
            <Button variant="outline">Back to Dashboard</Button>
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5" />
              Font Pairing
            </CardTitle>
            <CardDescription>
              Choose a font combination for your story writing pages. 
              This will apply to your stories, chapters, and writing editor.
              The main application uses Lustria + Lato for optimal UI readability.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <RadioGroup
              value={selectedPairing}
              onValueChange={(value) => setSelectedPairing(value as FontPairing)}
              className="space-y-4"
            >
              {Object.entries(fontPairings).map(([key, pairing]) => (
                <div
                  key={key}
                  className={`relative flex items-start space-x-4 rounded-lg border-2 p-6 transition-all cursor-pointer hover:bg-accent/50 ${
                    selectedPairing === key
                      ? 'border-primary bg-accent'
                      : 'border-border'
                  }`}
                  onClick={() => setSelectedPairing(key as FontPairing)}
                >
                  <RadioGroupItem value={key} id={key} className="mt-1" />
                  <div className="flex-1 space-y-4">
                    <Label htmlFor={key} className="cursor-pointer">
                      <div className="flex items-center justify-between">
                        <div className="font-semibold text-lg">
                          {pairing.title} + {pairing.body}
                        </div>
                        {selectedPairing === key && (
                          <Check className="h-5 w-5 text-primary" />
                        )}
                      </div>
                    </Label>
                    <div className="space-y-3 pt-2">
                      <div className={pairing.titleClass}>
                        <div className="text-sm text-muted-foreground mb-1">
                          Title Font: {pairing.title}
                        </div>
                        <div className="text-3xl font-bold">
                          The Art of Creative Writing
                        </div>
                      </div>
                      <div className={pairing.bodyClass}>
                        <div className="text-sm text-muted-foreground mb-1">
                          Body Font: {pairing.body}
                        </div>
                        <div className="text-base leading-relaxed">
                          In the realm of storytelling, words become the brushstrokes 
                          that paint vivid worlds. Each sentence carries the weight of 
                          imagination, transforming blank pages into portals of wonder. 
                          The writer's craft lies not just in what is said, but in how 
                          the story breathes life into the minds of readers.
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </RadioGroup>

            <div className="flex justify-end pt-4">
              <Button onClick={handleSave} size="lg">
                Save Changes
              </Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>About Font Pairings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-muted-foreground">
            <div>
              <h3 className="font-semibold text-foreground mb-2">Josefin Sans + Lato</h3>
              <p>
                A modern, geometric pairing that combines Josefin Sans's elegant, stylized 
                letterforms with Lato's warm, humanist design. Perfect for contemporary 
                fiction and creative non-fiction.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Playfair Display + Space Grotesk</h3>
              <p>
                A sophisticated contrast between Playfair Display's classical, high-contrast 
                serif and Space Grotesk's proportional, modern sans-serif. Ideal for literary 
                works, historical fiction, and serious drama.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Stardom + Epilogue</h3>
              <p>
                A contemporary pairing featuring Stardom's bold, expressive headlines with 
                Epilogue's clean, versatile body text. Great for modern storytelling and 
                dynamic narratives.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Stardom + EB Garamond</h3>
              <p>
                An elegant combination of Stardom's striking presence with EB Garamond's 
                classical serif beauty. Perfect for literary fiction, period pieces, and 
                sophisticated narratives.
              </p>
            </div>
            <div>
              <h3 className="font-semibold text-foreground mb-2">Stardom + Melodrama</h3>
              <p>
                A dramatic pairing that brings together Stardom's commanding titles with 
                Melodrama's expressive body text. Ideal for scripts, theatrical works, and 
                emotionally charged stories.
              </p>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}

