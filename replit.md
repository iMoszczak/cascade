# Overview

The Cascade Cipher web application is a full-stack cryptographic communication tool that implements a custom cipher algorithm. The application features both a chat interface for encrypted messaging and a standalone encryption/decryption tool. Built with modern web technologies, it provides a secure way to communicate using the Cascade Cipher algorithm with customizable parameters including cipher keys, start numbers, and group reversal options.

# User Preferences

Preferred communication style: Simple, everyday language.

# System Architecture

## Frontend Architecture

The client-side is built using **React** with **TypeScript** and follows a modern component-based architecture:

- **UI Framework**: Uses shadcn/ui components built on top of Radix UI primitives for consistent, accessible design
- **Styling**: Implements Tailwind CSS with a custom design system featuring navy blue (#1E3A8A) primary colors and light gray (#E5E7EB) backgrounds
- **State Management**: Utilizes React Query (@tanstack/react-query) for server state management and data fetching with automatic caching and synchronization
- **Routing**: Uses wouter for lightweight client-side routing
- **Form Handling**: Implements React Hook Form with Zod validation for type-safe form processing

The application structure separates concerns with dedicated components for chat functionality (`ChatInterface`) and cipher operations (`CipherTool`), promoting code reusability and maintainability.

## Backend Architecture

The server-side follows an **Express.js** REST API pattern:

- **Framework**: Node.js with Express.js providing HTTP server functionality
- **Data Storage**: Currently implements in-memory storage (`MemStorage`) with interfaces designed to support database integration
- **API Design**: RESTful endpoints for message management and cipher operations
- **Validation**: Server-side validation using Zod schemas shared between client and server
- **Error Handling**: Centralized error handling middleware with structured error responses

The modular design separates storage logic, routing, and business logic (cipher implementation) into distinct layers.

## Data Management

**Database Schema** (prepared for PostgreSQL via Drizzle ORM):
- **Users Table**: Stores user credentials with unique usernames
- **Messages Table**: Stores chat messages with encryption metadata including cipher keys, start numbers, and group reversal settings
- **Type Safety**: Shared TypeScript types between client and server using Drizzle Zod schemas

**Current Implementation**: Uses in-memory storage for development with interfaces ready for database integration.

## Cipher Implementation

The **Cascade Cipher** service implements a custom encryption algorithm:
- **Key Table Generation**: Creates dynamic substitution tables based on user-provided keys
- **Cascading Logic**: Each character's encryption depends on previous cipher values
- **Group Reversal**: Optional feature to reverse 5-character groups for additional security
- **Validation**: Strict input validation ensuring only A-Z characters and spaces are processed

## Development Environment

**Build System**:
- **Vite**: Modern build tool for fast development and optimized production builds
- **TypeScript**: Full type safety across the entire application
- **Development Tools**: Hot module replacement, runtime error overlays, and Replit-specific plugins for enhanced development experience

**Code Organization**:
- Shared schema definitions between client and server prevent type mismatches
- Path aliases for clean imports and better developer experience
- Modular component structure with UI components separated from business logic

# External Dependencies

## Core Framework Dependencies
- **@neondatabase/serverless**: PostgreSQL database connectivity (prepared for production database)
- **drizzle-orm & drizzle-kit**: Type-safe database operations and migrations
- **@tanstack/react-query**: Server state management and data synchronization
- **wouter**: Lightweight routing solution

## UI and Styling
- **@radix-ui/react-***: Comprehensive set of accessible UI primitives (dialogs, buttons, forms, etc.)
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority & clsx**: Dynamic class name generation and variants
- **lucide-react**: Icon library for consistent iconography

## Development and Build Tools
- **vite**: Build tool and development server
- **tsx**: TypeScript execution for server-side code
- **esbuild**: Fast JavaScript bundler for production builds
- **@replit/vite-plugin-***: Replit-specific development enhancements

## Form and Validation
- **react-hook-form**: Performant form management
- **@hookform/resolvers**: Integration layer for validation libraries
- **zod**: Schema validation library ensuring type safety across client and server

## Utility Libraries
- **date-fns**: Date manipulation and formatting
- **nanoid**: Unique ID generation for entities
- **cmdk**: Command palette component for enhanced user experience

The architecture is designed to be scalable and maintainable, with clear separation of concerns and preparation for production deployment with PostgreSQL database integration.