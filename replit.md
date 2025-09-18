# Account Management System

## Overview

This is a full-stack web application for managing user accounts with import functionality. The system allows users to view, create, update, and delete accounts, as well as import accounts from JavaScript files. Built with a React frontend using TypeScript and shadcn/ui components, and an Express.js backend with PostgreSQL database integration through Drizzle ORM.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **UI Library**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with CSS variables for theming
- **State Management**: TanStack Query (React Query) for server state management
- **Routing**: Wouter for lightweight client-side routing
- **Form Handling**: React Hook Form with Zod validation resolvers
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ESM modules
- **API Design**: RESTful API with standard HTTP methods
- **Validation**: Zod schemas for request/response validation
- **File Uploads**: Multer middleware for handling file uploads
- **Error Handling**: Centralized error handling middleware

### Data Storage Solutions
- **Database**: PostgreSQL with Neon serverless driver
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Connection pooling with @neondatabase/serverless

### Database Schema
- **Accounts Table**: Core entity with id, username, password, and status fields
- **Users Table**: Secondary entity with UUID primary key
- **Validation**: Zod schemas derived from Drizzle table definitions
- **Type Safety**: Full TypeScript integration for database operations

### API Structure
- **GET /api/accounts**: Retrieve all accounts
- **POST /api/accounts**: Create new account with validation
- **PATCH /api/accounts/:id/status**: Update account status
- **GET /api/accounts/stats**: Retrieve account statistics
- **DELETE /api/accounts/:id**: Delete account (implementation in storage layer)

### Authentication and Authorization
- **Session Management**: Configured for session-based authentication (infrastructure in place)
- **Security**: CORS configuration and request logging middleware
- **Validation**: Input validation on all endpoints using Zod schemas

## External Dependencies

### Database and ORM
- **Neon Database**: Serverless PostgreSQL database hosting
- **Drizzle ORM**: Type-safe ORM with PostgreSQL dialect
- **Drizzle Kit**: Database migrations and schema management

### UI Components
- **Radix UI**: Comprehensive set of accessible UI primitives
- **shadcn/ui**: Pre-built component library based on Radix UI
- **Lucide React**: Icon library for consistent iconography
- **Tailwind CSS**: Utility-first CSS framework

### Development Tools
- **TypeScript**: Static type checking and enhanced developer experience
- **Vite**: Fast build tool with HMR and optimized production builds
- **ESBuild**: Fast JavaScript bundler for server-side code
- **PostCSS**: CSS processing with Tailwind CSS integration

### Data Management
- **TanStack Query**: Powerful data synchronization for React
- **React Hook Form**: Performant forms with easy validation
- **Zod**: TypeScript-first schema validation library
- **date-fns**: Modern JavaScript date utility library

### File Handling
- **Multer**: Node.js middleware for handling multipart/form-data
- **File Upload**: Support for JavaScript file imports for account data

### Replit Integration
- **Runtime Error Overlay**: Development error handling
- **Cartographer**: Code navigation and mapping
- **Dev Banner**: Development environment indicators