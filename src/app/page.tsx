import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { ArrowRight, BookOpen, Users, Zap, Shield, Globe } from 'lucide-react'
import Link from 'next/link'
import { AuthStatus } from '@/components/auth-status'

export default async function HomePage() {
  try {
    const { userId } = await auth()

    if (userId) {
      redirect('/dashboard')
    }
  } catch (error) {
    // If Clerk is not properly configured, continue to show the landing page
    console.warn('Clerk authentication not configured:', error)
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="container mx-auto px-4 py-6">
        <nav className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <BookOpen className="h-8 w-8 text-primary" />
            <span className="text-2xl font-bold text-foreground">Storix</span>
          </div>
          <div className="flex items-center space-x-4">
            <Link href="/sign-in">
              <Button variant="ghost">Sign In</Button>
            </Link>
            <Link href="/sign-up">
              <Button>Get Started</Button>
            </Link>
          </div>
        </nav>
      </header>

      {/* Auth Status Debug */}
      <div className="container mx-auto px-4 py-4">
        <AuthStatus />
      </div>

      {/* Hero Section */}
      <main className="container mx-auto px-4 py-16">
        <div className="text-center max-w-4xl mx-auto">
          <h1 className="text-5xl font-bold text-foreground mb-6">
            Write Your Next Great Story
          </h1>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Storix is the ultimate platform for professional and hobbyist writers. 
            Create, collaborate, and publish your stories with AI-powered assistance 
            and real-time collaboration tools.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link href="/sign-up">
              <Button size="lg" className="text-lg px-8 py-6">
                Start Writing Free
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <Button variant="outline" size="lg" className="text-lg px-8 py-6">
              Watch Demo
            </Button>
          </div>
        </div>

        {/* Features Grid */}
        <div className="mt-24 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Zap className="h-6 w-6 text-primary" />
                <CardTitle>AI-Powered Writing</CardTitle>
              </div>
              <CardDescription>
                Get intelligent suggestions, character development, plot ideas, and writing improvements powered by advanced AI models.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Character generation and development</li>
                <li>• Plot suggestions and story structure</li>
                <li>• Grammar and style improvements</li>
                <li>• Research assistance and fact-checking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Users className="h-6 w-6 text-primary" />
                <CardTitle>Real-Time Collaboration</CardTitle>
              </div>
              <CardDescription>
                Collaborate with editors, beta readers, and co-authors in real-time with live editing, comments, and feedback.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Live collaborative editing</li>
                <li>• Comment and feedback system</li>
                <li>• Version control and history</li>
                <li>• Permission management</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <BookOpen className="h-6 w-6 text-primary" />
                <CardTitle>Professional Tools</CardTitle>
              </div>
              <CardDescription>
                Everything you need to plan, write, and publish your story with professional-grade tools and features.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Research and note-taking tools</li>
                <li>• Character and world-building</li>
                <li>• Publishing and export options</li>
                <li>• Analytics and progress tracking</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Shield className="h-6 w-6 text-primary" />
                <CardTitle>Secure & Private</CardTitle>
              </div>
              <CardDescription>
                Your work is protected with enterprise-grade security, encryption, and privacy controls.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• End-to-end encryption</li>
                <li>• Secure cloud storage</li>
                <li>• Privacy controls</li>
                <li>• GDPR compliant</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Globe className="h-6 w-6 text-primary" />
                <CardTitle>Offline Support</CardTitle>
              </div>
              <CardDescription>
                Work anywhere with full offline support and local AI model integration for complete privacy.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• Offline writing mode</li>
                <li>• Local AI models (Ollama)</li>
                <li>• Sync when online</li>
                <li>• Mobile support</li>
              </ul>
            </CardContent>
          </Card>

          <Card className="border-0 shadow-lg">
            <CardHeader>
              <div className="flex items-center space-x-2">
                <Badge variant="secondary" className="w-fit">Flexible</Badge>
                <CardTitle>Multiple AI Models</CardTitle>
              </div>
              <CardDescription>
                Choose from OpenAI, Claude, Gemini, or bring your own model. All compatible with OpenAI's API format.
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li>• OpenAI GPT models</li>
                <li>• Anthropic Claude</li>
                <li>• Google Gemini</li>
                <li>• Local models (Ollama)</li>
              </ul>
            </CardContent>
          </Card>
        </div>

        {/* Pricing Preview */}
        <div className="mt-24 text-center">
          <h2 className="text-3xl font-bold text-foreground mb-4">
            Simple, Transparent Pricing
          </h2>
          <p className="text-muted-foreground mb-8">
            Start free, upgrade when you need more power
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            <Card className="border-2">
              <CardHeader>
                <CardTitle>Free</CardTitle>
                <CardDescription>Perfect for getting started</CardDescription>
                <div className="text-3xl font-bold">$0<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ 10,000 words/month</li>
                  <li>✓ Basic AI suggestions</li>
                  <li>✓ 1 story</li>
                  <li>✓ Community support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2 border-primary">
              <CardHeader>
                <CardTitle>Pro</CardTitle>
                <CardDescription>For serious writers</CardDescription>
                <div className="text-3xl font-bold">$19<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Unlimited words</li>
                  <li>✓ Advanced AI features</li>
                  <li>✓ Unlimited stories</li>
                  <li>✓ Collaboration tools</li>
                  <li>✓ Priority support</li>
                </ul>
              </CardContent>
            </Card>

            <Card className="border-2">
              <CardHeader>
                <CardTitle>Enterprise</CardTitle>
                <CardDescription>For teams and organizations</CardDescription>
                <div className="text-3xl font-bold">$99<span className="text-sm font-normal">/month</span></div>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2 text-sm">
                  <li>✓ Everything in Pro</li>
                  <li>✓ Team management</li>
                  <li>✓ Custom AI models</li>
                  <li>✓ API access</li>
                  <li>✓ Dedicated support</li>
                </ul>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="mt-24 border-t border-border py-12">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="flex items-center space-x-2 mb-4 md:mb-0">
              <BookOpen className="h-6 w-6 text-primary" />
              <span className="text-lg font-semibold">Storix</span>
            </div>
            <div className="flex space-x-6 text-sm text-muted-foreground">
              <Link href="/privacy" className="hover:text-foreground">Privacy</Link>
              <Link href="/terms" className="hover:text-foreground">Terms</Link>
              <Link href="/support" className="hover:text-foreground">Support</Link>
              <Link href="/blog" className="hover:text-foreground">Blog</Link>
            </div>
          </div>
          <div className="mt-8 text-center text-sm text-muted-foreground">
            © 2024 Storix. All rights reserved.
          </div>
        </div>
      </footer>
    </div>
  )
}
