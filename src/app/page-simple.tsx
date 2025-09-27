import { redirect } from 'next/navigation'
import { auth } from '@clerk/nextjs/server'

export default async function SimpleHomePage() {
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
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold text-center text-gray-900 mb-8">
          Storix - Story Writing Platform
        </h1>
        
        <div className="max-w-2xl mx-auto text-center">
          <p className="text-lg text-gray-600 mb-8">
            A comprehensive platform for professional and hobbyist writers to create, collaborate, and publish their stories.
          </p>
          
          <div className="flex gap-4 justify-center">
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-6 py-3 rounded-lg font-medium transition-colors">
              Get Started
            </button>
            <button className="bg-white hover:bg-gray-50 text-gray-700 px-6 py-3 rounded-lg font-medium border border-gray-300 transition-colors">
              Learn More
            </button>
          </div>
        </div>
        
        <div className="mt-16 grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Write Stories
            </h3>
            <p className="text-gray-600">
              Create and edit your stories with our powerful writing tools.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Collaborate
            </h3>
            <p className="text-gray-600">
              Work with others in real-time on your writing projects.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6 text-center">
            <h3 className="text-xl font-semibold text-gray-800 mb-4">
              Publish
            </h3>
            <p className="text-gray-600">
              Share your stories with the world and get feedback.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
