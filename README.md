# Storix - Professional Story Writing Platform

A comprehensive platform for professional and hobbyist writers to create, collaborate, and publish their stories with AI-powered assistance.

## Features

### Core Writing Features

- **Rich Text Editor**: Professional writing environment with distraction-free mode
- **Draft Management**: Save, organize, and manage multiple drafts
- **Version Control**: Track changes and restore previous versions
- **Chapter Organization**: Structure your story with chapters and scenes

### AI-Powered Assistance

- **Multiple AI Models**: Support for OpenAI GPT, Claude, Gemini, and local models (Ollama)
- **Character Development**: AI-generated character descriptions and development
- **Plot Suggestions**: Intelligent plot ideas and story structure recommendations
- **Writing Improvement**: Grammar, style, and clarity suggestions
- **Research Assistance**: AI-powered research and fact-checking

### Collaboration Tools

- **Real-time Collaboration**: Live editing with multiple users
- **Comments & Feedback**: Inline comments and feedback system
- **Highlighting**: Text highlighting with notes and suggestions
- **Permission Management**: Granular control over collaboration permissions
- **Version History**: Track all changes and contributions

### Planning & Organization

- **Character Management**: Detailed character profiles and relationships
- **World Building**: Create and manage story worlds and settings
- **Research Library**: Organize research materials and references
- **Sticky Notes**: Digital sticky notes for quick ideas and reminders
- **Story Outlines**: Structured planning tools

### Publishing & Export

- **Multiple Formats**: Export to PDF, EPUB, DOCX, and more
- **Publishing Tools**: Direct publishing to various platforms
- **Analytics**: Writing progress and productivity tracking
- **Offline Support**: Work without internet connection

## Tech Stack

### Frontend

- **Next.js 14**: React framework with App Router
- **TypeScript**: Type-safe development
- **Tailwind CSS**: Utility-first CSS framework
- **Shadcn/ui**: High-quality component library
- **Clerk**: Authentication and user management
- **Socket.io**: Real-time collaboration
- **Zustand**: State management

### Backend

- **Node.js**: JavaScript runtime
- **Express.js**: Web framework
- **TypeScript**: Type-safe development
- **PostgreSQL**: Primary database
- **Prisma**: Database ORM
- **Socket.io**: Real-time communication
- **Multer**: File upload handling
- **Winston**: Logging

### AI Integration

- **OpenAI API**: GPT models
- **Anthropic API**: Claude models
- **Google AI**: Gemini models
- **Ollama**: Local AI models
- **Custom API**: OpenAI-compatible endpoints

## Getting Started

### Prerequisites

- Node.js 18+
- PostgreSQL 14+
- Redis (optional, for caching)
- Clerk account (for authentication) - [Setup Guide](CLERK_SETUP.md)

### Installation

1. **Clone the repository**

   ```bash
   git clone https://github.com/your-username/storix.git
   cd storix
   ```

2. **Install dependencies**

   ```bash
   # Install frontend dependencies
   npm install

   # Install backend dependencies
   cd backend
   npm install
   cd ..
   ```

3. **Set up environment variables**

   ```bash
   cp env.example .env.local
   ```

   Update the environment variables with your actual values:

   - Clerk authentication keys
   - Database connection string
   - AI API keys
   - File storage configuration

4. **Set up the database**

   ```bash
   cd backend
   npx prisma generate
   npx prisma db push
   cd ..
   ```

5. **Start the development servers**

   ```bash
   # Start backend server
   cd backend
   npm run dev

   # In a new terminal, start frontend server
   npm run dev
   ```

6. **Open your browser**
   Navigate to `http://localhost:3000`

## Project Structure

```
storix/
├── src/                          # Frontend source code
│   ├── app/                      # Next.js App Router
│   │   ├── dashboard/            # Dashboard pages
│   │   ├── sign-in/              # Authentication pages
│   │   └── sign-up/
│   ├── components/               # React components
│   │   ├── ui/                   # Shadcn/ui components
│   │   ├── dashboard/            # Dashboard components
│   │   └── editor/               # Writing editor components
│   ├── hooks/                    # Custom React hooks
│   ├── lib/                      # Utility functions
│   └── types/                    # TypeScript type definitions
├── backend/                      # Backend source code
│   ├── src/
│   │   ├── controllers/          # Route controllers
│   │   ├── middleware/           # Express middleware
│   │   ├── routes/               # API routes
│   │   ├── services/              # Business logic
│   │   ├── utils/                 # Utility functions
│   │   └── types/                # TypeScript types
│   ├── prisma/                   # Database schema
│   └── uploads/                   # File uploads (local storage)
├── public/                       # Static assets
└── docs/                         # Documentation
```

## API Endpoints

### Stories

- `GET /api/stories` - Get user's stories
- `POST /api/stories` - Create new story
- `GET /api/stories/:id` - Get specific story
- `PUT /api/stories/:id` - Update story
- `DELETE /api/stories/:id` - Delete story

### AI Services

- `POST /api/ai/generate` - Generate AI content
- `POST /api/ai/improve` - Improve writing
- `POST /api/ai/suggest` - Get suggestions
- `GET /api/ai/models` - Get available AI models

### Collaboration

- `GET /api/collaboration/:storyId/active-users` - Get active collaborators
- `POST /api/collaboration/:storyId/join` - Join story collaboration
- `POST /api/collaboration/invitations` - Send collaboration invitation

### Files

- `POST /api/files/upload` - Upload file
- `GET /api/files` - Get user's files
- `DELETE /api/files/:id` - Delete file

## Deployment

### Frontend (Vercel)

1. Connect your GitHub repository to Vercel
2. Set environment variables in Vercel dashboard
3. Deploy automatically on push to main branch

### Backend (Railway/Heroku/AWS)

1. Set up PostgreSQL database
2. Configure environment variables
3. Deploy using your preferred platform
4. Set up file storage (S3 for production)

### Docker Deployment

```bash
# Build and run with Docker Compose
docker-compose up -d
```

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Support

- Documentation: [docs.storix.com](https://docs.storix.com)
- Issues: [GitHub Issues](https://github.com/your-username/storix/issues)
- Discussions: [GitHub Discussions](https://github.com/your-username/storix/discussions)
- Email: support@storix.com

## Roadmap

- [ ] Mobile app (React Native)
- [ ] Advanced AI features (plot analysis, character consistency)
- [ ] Integration with publishing platforms
- [ ] Advanced analytics and insights
- [ ] Plugin system for custom features
- [ ] Multi-language support
- [ ] Advanced collaboration features (video calls, screen sharing)

## Acknowledgments

- Built with [Next.js](https://nextjs.org/)
- UI components from [Shadcn/ui](https://ui.shadcn.com/)
- Authentication by [Clerk](https://clerk.com/)
- Icons by [Lucide](https://lucide.dev/)
- Database by [Prisma](https://prisma.io/)
