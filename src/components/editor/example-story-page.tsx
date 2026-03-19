/**
 * Example Story Page Component
 * 
 * This demonstrates how to properly use the StoryEditorWrapper
 * to apply user-selected font pairings to story content only.
 */

'use client';

import { StoryEditorWrapper } from './story-editor-wrapper';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Settings } from 'lucide-react';
import Link from 'next/link';

export function ExampleStoryPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* 
        Navigation Header - Uses default app fonts (Lustria + Lato)
        This section should NOT be wrapped with StoryEditorWrapper
      */}
      <header className="border-b sticky top-0 bg-background/95 backdrop-blur z-10">
        <div className="max-w-7xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/dashboard">
              <Button variant="ghost" size="sm">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Dashboard
              </Button>
            </Link>
            <div>
              <h2 className="font-semibold">My Amazing Story</h2>
              <p className="text-xs text-muted-foreground">Last saved 2 minutes ago</p>
            </div>
          </div>
          <Link href="/dashboard/settings">
            <Button variant="outline" size="sm">
              <Settings className="h-4 w-4 mr-2" />
              Font Settings
            </Button>
          </Link>
        </div>
      </header>

      {/* 
        Story Content - Uses selected font pairing
        This section SHOULD be wrapped with StoryEditorWrapper
      */}
      <StoryEditorWrapper className="max-w-4xl mx-auto p-8">
        <article>
          <h1>Chapter One: The Beginning</h1>
          
          <p>
            It was a dark and stormy night when our hero first appeared on the 
            cobblestone streets of the old city. Rain poured down in sheets, 
            creating rivers that flowed through the ancient gutters.
          </p>

          <h2>The Mysterious Stranger</h2>
          
          <p>
            Through the mist, a figure emerged. Cloaked in shadow, their presence 
            seemed to command the very elements themselves. The storm grew quieter 
            as they approached, as if nature itself held its breath.
          </p>

          <blockquote>
            "In every ending, there is a new beginning waiting to be discovered."
          </blockquote>

          <p>
            The words echoed through the empty streets, carried by the wind that 
            had suddenly stilled. Our hero knew, in that moment, that nothing would 
            ever be the same again.
          </p>

          <h3>What Happens Next?</h3>

          <p>
            The adventure was only just beginning. With each step forward, new 
            mysteries would unfold, and the truth would slowly reveal itself like 
            the dawn breaking through storm clouds.
          </p>
        </article>
      </StoryEditorWrapper>

      {/* 
        Sidebar/Comments - Uses default app fonts
        This section should NOT be wrapped with StoryEditorWrapper
      */}
      <aside className="fixed right-0 top-16 w-80 h-screen border-l p-4 bg-card">
        <h3 className="font-semibold mb-4">Comments & Notes</h3>
        <div className="space-y-3">
          <div className="text-sm p-3 bg-muted rounded-lg">
            <p className="font-medium">Editorial Note</p>
            <p className="text-muted-foreground mt-1">
              Great opening! Consider adding more sensory details.
            </p>
          </div>
        </div>
      </aside>
    </div>
  );
}

