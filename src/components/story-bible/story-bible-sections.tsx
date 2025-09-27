'use client'

import { useState } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { RichTextEditor } from '@/components/editor/rich-text-editor'
import { 
  Copy, 
  Clock, 
  Sparkles, 
  Plus,
  Settings,
  Users,
  Globe,
  List,
  Lightbulb,
  BookOpen,
  PenTool
} from 'lucide-react'
import { cn } from '@/lib/utils'

interface StoryBibleSection {
  id: string
  title: string
  content: string
  instructions: string
  placeholder: string
  showGenerateButton?: boolean
  showSubGenres?: boolean
  showCustomizeButton?: boolean
  showAddButtons?: boolean
}

interface StoryBibleSectionsProps {
  activeSection: string
  className?: string
}

export function StoryBibleSections({ activeSection, className }: StoryBibleSectionsProps) {
  const [sections, setSections] = useState<Record<string, StoryBibleSection>>({
    braindump: {
      id: 'braindump',
      title: 'Braindump',
      content: '',
      instructions: 'Write a braindump of everything you know about the story. You can include information about plot, characters, worldbuilding, theme - anything!',
      placeholder: 'Write everything you know about your story here...',
      showSubGenres: true
    },
    genre: {
      id: 'genre',
      title: 'Genre',
      content: '',
      instructions: 'Choose one to set the tone of your prose.',
      placeholder: 'Select or describe your genre...',
      showGenerateButton: true
    },
    style: {
      id: 'style',
      title: 'Style',
      content: '',
      instructions: 'Choose one to set the tone of your prose.',
      placeholder: 'Select your writing style...',
      showGenerateButton: true
    },
    synopsis: {
      id: 'synopsis',
      title: 'Synopsis',
      content: '',
      instructions: 'Introduce the characters, their goals, and the central conflict, while conveying the story\'s tone, themes, and unique elements.',
      placeholder: 'Write your story synopsis here...',
      showGenerateButton: true
    },
    characters: {
      id: 'characters',
      title: 'Characters',
      content: '',
      instructions: 'Develop your characters with detailed profiles, motivations, and relationships.',
      placeholder: 'Add character information here...',
      showCustomizeButton: true,
      showAddButtons: true
    },
    worldbuilding: {
      id: 'worldbuilding',
      title: 'Worldbuilding',
      content: '',
      instructions: 'Bring your world to life with Locations, Lore, Magic, and more.',
      placeholder: 'Describe your world here...',
      showCustomizeButton: true,
      showAddButtons: true
    },
    outline: {
      id: 'outline',
      title: 'Outline',
      content: '',
      instructions: 'Structure your story with a detailed outline.',
      placeholder: 'Create your story outline here...',
      showGenerateButton: true
    }
  })

  const updateSectionContent = (sectionId: string, content: string) => {
    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content
      }
    }))
  }

  const getSectionIcon = (sectionId: string) => {
    switch (sectionId) {
      case 'braindump':
        return <Lightbulb className="h-5 w-5" />
      case 'genre':
        return <BookOpen className="h-5 w-5" />
      case 'style':
        return <PenTool className="h-5 w-5" />
      case 'synopsis':
        return <BookOpen className="h-5 w-5" />
      case 'characters':
        return <Users className="h-5 w-5" />
      case 'worldbuilding':
        return <Globe className="h-5 w-5" />
      case 'outline':
        return <List className="h-5 w-5" />
      default:
        return <BookOpen className="h-5 w-5" />
    }
  }

  const currentSection = sections[activeSection]

  if (!currentSection) {
    return (
      <div className={cn("p-6", className)}>
        <div className="text-center text-gray-500">
          Select a Story Bible section to get started
        </div>
      </div>
    )
  }

  return (
    <div className={cn("p-6 space-y-6", className)}>
      {/* Section Header */}
      <div className="flex items-center gap-3">
        {getSectionIcon(activeSection)}
        <h2 className="text-2xl font-bold text-gray-900">{currentSection.title}</h2>
      </div>

      {/* Instructions */}
      <p className="text-gray-600">{currentSection.instructions}</p>

      {/* Main Content */}
      <Card className="border-2 border-dashed border-gray-200 bg-gradient-to-br from-pink-50 to-purple-50">
        <CardContent className="p-6">
          <RichTextEditor
            content={currentSection.content}
            placeholder={currentSection.placeholder}
            onChange={(content) => updateSectionContent(activeSection, content)}
            className="min-h-[300px]"
          />
          
          {/* Action Buttons */}
          <div className="flex items-center justify-between mt-4">
            <div className="flex items-center gap-2">
              <Button variant="ghost" size="sm">
                <Copy className="h-4 w-4 mr-2" />
                Copy
              </Button>
              <Button variant="ghost" size="sm">
                <Clock className="h-4 w-4 mr-2" />
                History
              </Button>
            </div>
            
            {currentSection.showGenerateButton && (
              <Button className="bg-purple-600 hover:bg-purple-700">
                <Sparkles className="h-4 w-4 mr-2" />
                Generate {currentSection.title}
              </Button>
            )}
          </div>
        </CardContent>
      </Card>

      {/* Sub-genres (for Braindump) */}
      {currentSection.showSubGenres && (
        <Card>
          <CardContent className="p-6">
            <h3 className="text-lg font-semibold mb-3">Sub-genres and tropes</h3>
            <RichTextEditor
              placeholder="Romance, Horror, Fantasy, Cozy mystery, Friends-to-Lovers, Gumshoe..."
              className="min-h-[100px]"
            />
            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center gap-2">
                <Button variant="ghost" size="sm">
                  <Copy className="h-4 w-4 mr-2" />
                  Copy
                </Button>
                <Button variant="ghost" size="sm">
                  <Clock className="h-4 w-4 mr-2" />
                  History
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Style Options (for Genre/Style) */}
      {(activeSection === 'genre' || activeSection === 'style') && (
        <div className="grid grid-cols-3 gap-4">
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <span className="font-semibold">Featured Styles</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <span className="font-semibold">Match My Style</span>
          </Button>
          <Button variant="outline" className="h-20 flex flex-col items-center justify-center">
            <span className="font-semibold">Custom</span>
          </Button>
        </div>
      )}

      {/* Character/Worldbuilding Actions */}
      {(currentSection.showCustomizeButton || currentSection.showAddButtons) && (
        <div className="flex items-center justify-between">
          {currentSection.showCustomizeButton && (
            <Button variant="outline">
              <Settings className="h-4 w-4 mr-2" />
              Customize
            </Button>
          )}
          
          {currentSection.showAddButtons && (
            <div className="flex items-center gap-2">
              <Button variant="outline">
                <Plus className="h-4 w-4 mr-2" />
                Add {activeSection === 'characters' ? 'Character' : 'Element'}...
              </Button>
              {activeSection === 'characters' && (
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Character...
                </Button>
              )}
              {activeSection === 'worldbuilding' && (
                <Button variant="outline">
                  <Sparkles className="h-4 w-4 mr-2" />
                  Generate Element...
                </Button>
              )}
            </div>
          )}
        </div>
      )}

      {/* Worldbuilding Quick Add Buttons */}
      {activeSection === 'worldbuilding' && (
        <div className="grid grid-cols-4 gap-2">
          {[
            'Add a blank...',
            '+ Custom',
            '+ Setting',
            '+ Organization',
            '+ Lore',
            '+ Key Event',
            '+ Clue',
            '+ Magic System',
            '+ Item',
            '+ Technology',
            '+ Government',
            '+ Economy',
            '+ Culture',
            '+ Religion'
          ].map((label) => (
            <Button key={label} variant="outline" size="sm" className="text-xs">
              {label}
            </Button>
          ))}
        </div>
      )}
    </div>
  )
}
