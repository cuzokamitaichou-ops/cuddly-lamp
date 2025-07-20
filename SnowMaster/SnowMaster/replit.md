# Replit.md

## Overview

This is a comprehensive Discord multipurpose bot with a full-stack management dashboard. "Snow" is a 16-year-old cute, kawaii, winter-themed Discord bot with extensive command categories including Economy, Fun, Memes, Image Generation, AI Chatbot, Moderation, and Administration features. The web dashboard provides owner-only access for managing bot settings, AI personality configuration, user blacklists, and viewing live statistics. The bot includes automatic security features that detect and blacklist abuse attempts.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Styling**: TailwindCSS with custom winter/snow theme variables
- **UI Components**: Radix UI primitives with shadcn/ui component library
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Framework**: Express.js with TypeScript
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (@neondatabase/serverless)
- **API Pattern**: RESTful API design
- **Authentication**: Custom middleware checking Discord user IDs against owner list
- **Development**: Hot module replacement with Vite integration

### Discord Bot Architecture
- **Framework**: Discord.js v14 with Node.js CommonJS modules
- **Bot Token**: Hardcoded public token (MTM5NjM1NDc2Njk3NTY2ODM3NQ.Ge9-jH.72H-9iLZTs-7cbDflwM-8NCHBVMqcFbLJBAeLQ)
- **Database Integration**: Direct PostgreSQL connection with shared schema
- **Command Categories**: Economy, Fun, Memes, Moderation, Administration, AI Chat, Info
- **Security Features**: Auto-detection and blacklisting of abuse attempts
- **Real-time Stats**: Live server count, user count, and command usage tracking
- **AI Personality**: 16-year-old kawaii winter-themed responses with configurable traits

### Data Storage Solutions
- **Database**: PostgreSQL with Neon Database (@neondatabase/serverless)
- **ORM**: Drizzle ORM with PostgreSQL dialect
- **Schema Location**: Shared schema definitions in `/shared/schema.ts`
- **Migrations**: Drizzle Kit for database migrations (`npm run db:push`)
- **Storage Interface**: DatabaseStorage implementation with full CRUD operations
- **Seeding**: Automatic database initialization with default bot settings and owner accounts

## Key Components

### Database Schema
- **users**: Discord user management (id, username, role)
- **botSettings**: Bot profile configuration (username, bio, status, avatar, token)
- **aiSettings**: AI personality settings (name, age, vibe, traits, response speed)
- **blacklistedUsers**: User blacklist management
- **botStats**: Bot usage statistics (servers, users, commands)

### Frontend Components
- **Dashboard**: Main management interface with tabbed layout
- **Authentication**: Login system for bot owners only
- **Bot Management**: Profile editing, status control, token management
- **AI Configuration**: Personality traits, response settings, security levels
- **Blacklist Management**: Add/remove users from blacklist
- **Statistics Display**: Bot usage metrics and analytics
- **Theme Features**: Animated snowfall effect, glassmorphism design

### Backend API Routes
- **Authentication**: `/api/auth/login` - Code-based owner verification
- **Bot Settings**: CRUD operations for bot configuration
- **AI Settings**: Personality and behavior configuration
- **Blacklist**: User blacklist management endpoints
- **Statistics**: Bot metrics and usage data

### Discord Bot Commands
- **Economy**: `!balance`, `!daily`, `!work` - Snow Crystal currency system
- **Fun**: `!hug`, `!snowball`, `!cute`, `!8ball` - Interactive entertainment commands
- **Memes**: `!meme`, `!joke`, `!roast` - Comedy and meme generation
- **Moderation**: `!kick`, `!ban`, `!clear` - Server management tools
- **Information**: `!stats`, `!serverinfo`, `!userinfo`, `!help` - Data retrieval
- **AI Chat**: Mention bot for kawaii personality responses
- **Image Generation**: `!imagegen` - Placeholder for future AI art features
- **Security**: Auto-detection of hack/exploit attempts with automatic blacklisting

### Authentication System
- **Access Method**: Special access codes instead of Discord User IDs
- **Owner Code**: "YeahImCelis" - Main owner access
- **Co-Owner Code**: "YeahImSilly" - Co-owner access
- **Security**: Code validation happens client-side before API authentication

## Data Flow

1. **Authentication Flow**: Users login with Discord ID, validated against owner list
2. **Data Fetching**: React Query manages API calls with caching and background updates
3. **State Updates**: Mutations trigger cache invalidation and UI updates
4. **Real-time Updates**: Optimistic updates with error handling and rollback

## External Dependencies

### Frontend Dependencies
- **UI Framework**: React, React DOM
- **State Management**: TanStack React Query
- **Styling**: TailwindCSS, PostCSS, Autoprefixer
- **UI Components**: Radix UI primitives, Lucide React icons
- **Form Handling**: React Hook Form with Zod validation
- **Utility Libraries**: clsx, class-variance-authority, date-fns

### Backend Dependencies
- **Server**: Express.js, HTTP server
- **Database**: Drizzle ORM, Neon Database driver
- **Validation**: Zod schema validation
- **Session**: PostgreSQL session store (connect-pg-simple)
- **Development**: tsx for TypeScript execution, esbuild for production builds

### Build Tools
- **Bundler**: Vite with React plugin
- **TypeScript**: Full TypeScript support with strict configuration
- **Development**: Replit integration plugins, runtime error overlay
- **Database**: Drizzle Kit for migrations and schema management

## Deployment Strategy

### Development
- **Local Development**: Vite dev server with HMR and Express backend
- **Database**: Environment variable `DATABASE_URL` for connection
- **Scripts**: `npm run dev` for development, `npm run check` for type checking

### Production
- **Build Process**: Vite builds frontend to `/dist/public`, esbuild bundles server
- **Server**: Node.js with ESM modules
- **Database**: PostgreSQL with Drizzle ORM migrations
- **Environment**: Production environment variables for database and authentication

### Key Configuration Files
- **Vite Config**: Frontend build configuration with path aliases
- **Drizzle Config**: Database configuration and migration settings
- **TypeScript Config**: Strict typing with path mappings for imports
- **Tailwind Config**: Custom theme with winter/snow color palette

The application follows a modern full-stack architecture with type safety throughout, efficient state management, and a cohesive design system optimized for Discord bot management workflows.