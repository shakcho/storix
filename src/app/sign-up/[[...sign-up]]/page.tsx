import { SignUp } from '@clerk/nextjs'

export default function SignUpPage() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-gray-900 dark:to-gray-800">
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-foreground mb-2">Join Storix</h1>
          <p className="text-muted-foreground">Start your writing journey today</p>
        </div>
        <SignUp 
          redirectUrl="/dashboard"
          signInUrl="/sign-in"
          appearance={{
            elements: {
              formButtonPrimary: 'bg-primary hover:bg-primary/90',
              card: 'shadow-lg border-0',
            }
          }}
        />
      </div>
    </div>
  )
}
