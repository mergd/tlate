# TLate - AI Translation Platform

## Project Overview
TLate is an AI-powered document translation platform built with Next.js, Convex, and modern web technologies. It provides version control for translations, collaborative features, and multiple AI model support.

## Tech Stack
- **Frontend**: Next.js 15, React 19, TypeScript
- **Backend**: Convex (database + server logic)
- **Authentication**: Convex Auth
- **Styling**: Tailwind CSS 4, Radix UI components
- **Editor**: TipTap (rich text editor)
- **AI Integration**: AI SDK with Anthropic and OpenAI support
- **Themes**: next-themes for light/dark mode

## Project Structure

### Core Directories
- `app/` - Next.js App Router pages and API routes
- `components/` - Reusable React components organized by feature
- `convex/` - Backend schema, functions, and API definitions
- `lib/` - Utility functions and configurations

### Key Features
1. **Document Management**: Projects → Documents → Versions hierarchy
2. **AI Translation**: Multiple AI models (Claude, GPT, etc.) via AI SDK
3. **Version Control**: Document versioning with diff tracking
4. **Dictionaries**: User and project-level translation dictionaries
5. **Real-time Chat**: AI chat interface for translation assistance
6. **Authentication**: Secure user management with Convex Auth

## Development Workflow

### Scripts
- `npm run dev` - Start development servers (frontend + backend)
- `npm run build` - Production build
- `npm run lint` - ESLint validation

### Code Conventions
- **File naming**: camelCase for components, kebab-case for pages
- **Import paths**: Use `@/` alias for root imports
- **Styling**: Tailwind classes with clsx for conditional styling
- **Components**: Functional components with TypeScript
- **No comments**: Code should be self-documenting unless complex logic requires explanation

### Database Schema (Convex)
- `projects` - Translation projects with source/target languages
- `documents` - Documents within projects
- `documentVersions` - Version control for document translations
- `userDictionaries` & `projectDictionaries` - Translation glossaries
- `chatConversations` & `chatMessages` - AI chat system
- `userSettings` - User preferences and AI model settings

### Component Architecture
- `components/ui/` - Base UI components (buttons, dialogs, etc.)
- `components/dashboard/` - Dashboard-specific components
- `components/editor/` - Document editing components
- `components/chat/` - AI chat interface components
- `components/theme/` - Theme management components

### Styling Guidelines
- Use Tailwind utility classes
- Dark mode support via `next-themes`
- Responsive design with mobile-first approach
- Consistent spacing using Tailwind scale
- Typography using Geist (sans) and Source Serif 4 fonts

### State Management
- Server state: Convex queries/mutations
- Client state: React useState/useContext
- Theme state: next-themes provider
- Authentication: Convex Auth hooks

### Development Notes
- All pages use TypeScript strict mode
- ESLint config extends Next.js and TypeScript rules
- Prettier for code formatting
- Hot reload enabled with Turbopack in development
- Environment variables for AI API keys and Convex config

### Testing & Quality
- TypeScript for type safety
- ESLint for code quality
- Run `npm run lint` before commits
- No automated tests currently configured

### AI Integration
- Multiple AI providers supported via AI SDK
- User-configurable AI models in settings
- Chat interface for translation assistance
- Translation instructions and context support

### Authentication Flow
- Convex Auth handles user sessions
- Protected routes via middleware
- User settings stored in Convex database
- Sign-in page at `/signin`

This is a modern, full-stack translation platform with emphasis on AI assistance, version control, and collaborative features.