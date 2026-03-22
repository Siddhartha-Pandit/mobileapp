
# Application Consistency Guide

This document outlines the rules and guidelines to maintain consistency across the application. Following these guidelines will ensure a cohesive user experience, streamlined development, and a high-quality product.

## 1. Guiding Principles

- **User-Centric:** Always prioritize the user's experience. The app should be intuitive, easy to navigate, and forgiving of errors.
- **Consistency over Convention:** While we adhere to platform conventions (iOS and Android), consistency within the app is paramount.
- **Offline-First:** The app must be functional without an internet connection. All actions should be saved to a local database first and then synced with the server when a connection is available.
- **One-Handed Usability:** Design for one-handed use. Critical UI elements should be within easy reach of the thumb.
- **Responsive and Adaptive:** The UI should adapt to different screen sizes, from small phones to tablets.

## 2. UI/UX Style Guide

### Colors

- **Primary:** `(brandPrimary)` - Used for primary actions, buttons, and highlights.
- **Secondary:** `(brandSecondary)` - Used for secondary actions and information.
- **Accent:** `(accent)` - Used for floating action buttons and special highlights.
- **Text Primary:** `(textPrimary)` - For main body text.
- **Text Secondary:** `(textSecondary)` - For less important text, subtitles, and hints.
- **Background:** `(background)` - The main background color of the app.
- **Surface:** `(surface)` - For card backgrounds and sheets.
- **Error:** `(error)` - For error messages and destructive actions.

*Note: These color names should be part of a theme that is applied throughout the app. Use the `useTheme` hook to access these colors.*

### Typography

- **Heading 1:** 24pt, Bold
- **Heading 2:** 20pt, Bold
- **Body:** 16pt, Regular
- **Subtitle:** 14pt, Medium
- **Caption:** 12pt, Regular

### Component Library

Use the shared components from the `components/` directory whenever possible. If a new component is needed, it should be designed to be reusable and added to the library.

- **Buttons:** Use the `PrimaryButton` for main CTAs.
- **Cards:** Use the `Card` component for displaying content in a structured manner.
- **Input Fields:** Use `SelectField` and other custom input components.

## 3. API Implementation

- **Offline Sync:** All data mutations (create, update, delete) must be handled by the offline-first sync mechanism.
  1.  When a user performs an action, the data is written to the local database (e.g., WatermelonDB or SQLite).
  2.  The UI is updated immediately based on the local data.
  3.  The change is added to a sync queue.
  4.  When an internet connection is available, the sync queue is processed, and the changes are sent to the server.
- **API Endpoints:** API endpoints should be versioned (e.g., `/api/v1/...`).
- **Error Handling:** Gracefully handle API errors. Display a non-intrusive message to the user and log the error for debugging.

## 4. Database

- **Schema:** The database schema is defined in `src/db/schema.ts`. All schema changes must be versioned and migrated properly.
- **Queries:** All database queries should be efficient and optimized for performance.

## 5. Mobile and Responsive Design

- **Layout:** Use Flexbox for creating responsive layouts. Avoid fixed dimensions where possible.
- **Breakpoints:** For tablet and larger screens, consider using a multi-pane layout.
- **One-Handed Use:**
  - Primary navigation (like the bottom tab bar) should be at the bottom of the screen.
  - Frequently used actions should be placed in the lower half of the screen.
  - Use gestures to supplement navigation where it makes sense.

## 6. Code Style and Conventions

- **File Naming:** Use kebab-case for file names (e.g., `user-profile.tsx`).
- **Component Naming:** Use PascalCase for component names (e.g., `UserProfile`).
- **Linting:** Adhere to the ESLint rules defined in `eslint.config.js`. Run the linter before committing code.

By following these guidelines, we can build a consistent, robust, and user-friendly application.
