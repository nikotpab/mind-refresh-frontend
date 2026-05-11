# Mind Refresh - Frontend Client

## Overview

Mind Refresh is a modern, responsive Single Page Application (SPA) designed to foster corporate wellness. Built with Angular, it provides employees with interfaces for daily emotional check-ins, event registration, and peer-to-peer motivational interactions, while offering administrators comprehensive sentiment analytics and strategic dashboards.

## Architecture & Tech Stack

*   **Framework:** Angular 21 (TypeScript)
*   **Styling:** Tailwind CSS with custom Neumorphic design patterns
*   **Typography:** Somatic Rounded & Plus Jakarta Sans
*   **Real-time Client:** Socket.io-client
*   **State Management:** RxJS (BehaviorSubjects for predictable data flow)

## Prerequisites

*   Node.js (v20 or higher recommended)
*   npm (v10 or higher)
*   Angular CLI (`npm install -g @angular/cli`)
*   Docker & Docker Compose (for containerized deployment)

## Environment Configuration

The application uses Angular environments to manage API endpoints. 

**Development (`src/environments/environment.ts`):**
```typescript
export const environment = {
  production: false,
  apiUrl: 'http://localhost:3000/api/v1',
  wsUrl: 'http://localhost:3000'
};
```

**Production (`src/environments/environment.prod.ts`):**
```typescript
export const environment = {
  production: true,
  apiUrl: '/api/v1',
  wsUrl: '' // Inferred from origin in production proxy setups
};
```

## Installation

1. Install dependencies:
```bash
npm install
```

## Running the Application

### Local Development

Run the development server with live-reloading:

```bash
ng serve
```
Navigate to `http://localhost:4200/`.

### Production Build

Compile the application into an output directory (`dist/mind-refresh-frontend/browser`):

```bash
npm run build
```

## Docker Deployment

The project features a multi-stage Dockerfile that builds the Angular application and serves the static assets using a lightweight Nginx container. It includes custom Nginx routing to support the Angular router.

```bash
# Build the image
docker build -t mind-refresh-frontend .

# Run the container
docker run -p 80:80 mind-refresh-frontend
```

Alternatively, orchestrate alongside the backend using the root `docker-compose.yml`.

## Key Features

*   **Neumorphic UI:** A consistent, tactile design language utilizing custom CSS variables and utility classes.
*   **Real-time Notifications:** Global modal alerts integrated with WebSockets via `NotificationsService` and `NgZone` for instantaneous UI updates.
*   **Role-Based Routing:** Route protection using `AuthGuard` and `RoleGuard` to segregate employee views from executive dashboards.
*   **Interceptors:** Centralized JWT token attachment for secure API communication.
